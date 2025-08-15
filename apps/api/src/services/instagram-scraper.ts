import { ApifyClient } from 'apify-client';

/**
 * Raw Instagram profile data from Apify scraper
 */
export interface InstagramProfile {
  id: string;
  username: string;
  fullName: string;
  biography: string;
  followersCount: number;
  profilePicUrlHD: string;
  profilePicUrl: string;
  verified?: boolean;
  latestPosts?: Array<{
    displayUrl: string;
    caption?: string;
    likesCount: number;
    commentsCount: number;
  }>;
}

/**
 * Standardized teacher profile format for frontend consumption
 * All image URLs are pre-proxied through our API to bypass CORS
 */
export interface HotTeacherProfile {
  id: string;
  handle: string;
  displayName: string;
  heroImage: string;
  gridImages: string[];
  stats: {
    followers: string;
    sessions: number;
    rating: number;
  };
  tags: string[];
  vibe: string;
  verified: boolean;
}

/**
 * Instagram Scraper Service
 * 
 * Fetches yoga teacher profiles from Instagram using Apify
 * and transforms them into a standardized format with proxied images
 */
export class InstagramScraper {
  private client: ApifyClient;
  private actorId = 'apify/instagram-scraper';

  constructor(token: string) {
    this.client = new ApifyClient({
      token,
    });
  }

  private formatFollowerCount(count: number): string {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  }

  private extractTagsFromBio(bio: string): string[] {
    const yogaKeywords = [
      'vinyasa', 'ashtanga', 'hatha', 'yin', 'power yoga', 'hot yoga',
      'kundalini', 'iyengar', 'flow', 'meditation', 'breathwork',
      'inversions', 'arm balances', 'flexibility', 'strength', 'yoga'
    ];
    
    const bioLower = bio.toLowerCase();
    const foundTags = yogaKeywords.filter(keyword => bioLower.includes(keyword));
    
    const hashtagMatches = bio.match(/#\w+/g) || [];
    const hashtags = hashtagMatches
      .map(tag => tag.substring(1))
      .filter(tag => yogaKeywords.some(kw => kw.includes(tag.toLowerCase())));
    
    const allTags = [...new Set([...foundTags, ...hashtags])]
      .slice(0, 3)
      .map(tag => tag.charAt(0).toUpperCase() + tag.slice(1));
    
    return allTags.length > 0 ? allTags : ['Yoga', 'Wellness', 'Flow'];
  }

  private proxyImageUrl(originalUrl: string): string {
    if (!originalUrl) return '';
    // Use our proxy endpoint for Instagram images
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
    return `${baseUrl}/api/proxy/image?url=${encodeURIComponent(originalUrl)}`;
  }

  private transformToHotTeacherProfile(
    profile: InstagramProfile,
    index: number
  ): HotTeacherProfile {
    const gridImages = profile.latestPosts
      ?.slice(0, 3)
      .map(post => this.proxyImageUrl(post.displayUrl)) || [];

    const biography = profile.biography || '';
    const bioLines = biography.split('\n');
    const vibe = bioLines[0] || `Yoga teacher sharing the journey`;

    const tags = this.extractTagsFromBio(biography);

    // Proxy the hero image URL
    const heroImage = this.proxyImageUrl(profile.profilePicUrlHD || profile.profilePicUrl || '');

    return {
      id: profile.id || `ig_${profile.username}`,
      handle: profile.username,
      displayName: profile.fullName || profile.username,
      heroImage,
      gridImages,
      stats: {
        followers: this.formatFollowerCount(profile.followersCount || 0),
        sessions: Math.floor(Math.random() * 1000) + 100,
        rating: 4.5 + Math.random() * 0.5
      },
      tags,
      vibe,
      verified: profile.verified || false
    };
  }

  async scrapeProfiles(handles: string[]): Promise<HotTeacherProfile[]> {
    try {
      console.log('Starting Instagram scrape for handles:', handles);
      
      const runInput = {
        directUrls: handles.map(handle => 
          handle.startsWith('http') ? handle : `https://www.instagram.com/${handle}/`
        ),
        resultsType: 'details',
        resultsLimit: 10,
        searchType: 'user'
      };

      console.log('Running actor with input:', runInput);
      
      const run = await this.client.actor(this.actorId).call(runInput);
      
      console.log('Actor run completed:', run);

      const { items } = await this.client.dataset(run.defaultDatasetId).listItems();
      
      console.log('Retrieved items:', items);

      const profiles = items as any[];
      
      // Filter out error results and only process valid profiles
      const validProfiles = profiles.filter(item => 
        item.username && item.biography !== undefined && !item.error
      );
      
      console.log(`Found ${validProfiles.length} valid profiles out of ${profiles.length} results`);
      
      return validProfiles.map((profile, index) => 
        this.transformToHotTeacherProfile(profile as InstagramProfile, index)
      );
    } catch (error) {
      console.error('Error scraping Instagram profiles:', error);
      throw error;
    }
  }
}

export const createInstagramScraper = (token: string) => {
  if (!token) {
    throw new Error('Apify token is required');
  }
  return new InstagramScraper(token);
};

export const DEFAULT_YOGA_HANDLES = [
  'yoginastya',
  'vi_zahvatova', 
  'mila.yoga.balance'
];