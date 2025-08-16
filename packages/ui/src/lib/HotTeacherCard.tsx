import * as React from 'react'
import './HotTeacherCard.css'

export type HotTeacherProfile = {
  id: string
  handle: string
  displayName: string
  heroImage: string
  gridImages: string[]
  stats: {
    followers: string
    sessions: number
    rating: number
  }
  tags: string[]
  vibe: string
  verified?: boolean
  instagramHandle?: string
}

export type HotTeacherCardProps = {
  teacher: HotTeacherProfile
  onSelect?: () => void
  isSelected?: boolean
  compact?: boolean
}

export const HotTeacherCard: React.FC<HotTeacherCardProps> = ({
  teacher,
  onSelect,
  isSelected = false,
  compact = false
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [isSwipeRevealed, setIsSwipeRevealed] = React.useState(false)
  const [touchStart, setTouchStart] = React.useState<number | null>(null)
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isRightSwipe && teacher.instagramHandle) {
      setIsSwipeRevealed(true)
    } else if (isLeftSwipe) {
      setIsSwipeRevealed(false)
    }
  }

  const handleInstagramClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (teacher.instagramHandle) {
      window.open(`https://instagram.com/${teacher.instagramHandle}`, '_blank')
    }
  }
  
  return (
    <div 
      className={`hot-teacher-card ${isSelected ? 'selected' : ''} ${compact ? 'compact' : ''} ${isSwipeRevealed ? 'swipe-revealed' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.()}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="hot-teacher-card__visual">
        <div className="hot-teacher-card__hero">
          <img 
            src={teacher.heroImage} 
            alt={teacher.displayName}
            onLoad={() => setImageLoaded(true)}
            className={imageLoaded ? 'loaded' : ''}
          />
          <div className="hot-teacher-card__overlay">
            <div className="hot-teacher-card__handle">
              @{teacher.handle}
              {teacher.verified && <span className="verified">✓</span>}
            </div>
          </div>
        </div>
        
        {!compact && (
          <div className="hot-teacher-card__grid">
            {teacher.gridImages.slice(0, 3).map((img, idx) => (
              <div key={idx} className="hot-teacher-card__grid-item">
                <img src={img} alt="" />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="hot-teacher-card__content">
        <div className="hot-teacher-card__header">
          <h3 className="hot-teacher-card__name">{teacher.displayName}</h3>
          <p className="hot-teacher-card__vibe">{teacher.vibe}</p>
        </div>
        
        <div className="hot-teacher-card__stats">
          <span className="stat">
            <strong>{teacher.stats.followers}</strong> followers
          </span>
          <span className="stat">
            <strong>{teacher.stats.sessions}</strong> sessions
          </span>
          <span className="stat">
            <strong>{teacher.stats.rating}</strong> ★
          </span>
        </div>
        
        <div className="hot-teacher-card__tags">
          {teacher.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        
        <button 
          className={`hot-teacher-card__cta ${isSelected ? 'selected' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onSelect?.()
          }}
        >
          {isSelected ? '✓ Selected' : 'Request Session'}
        </button>
      </div>

      {teacher.instagramHandle && (
        <div 
          className={`hot-teacher-card__instagram-reveal ${isSwipeRevealed ? 'revealed' : ''}`}
          onClick={handleInstagramClick}
        >
          <div className="instagram-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="url(#instagram-gradient)"/>
              <defs>
                <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f09433" />
                  <stop offset="25%" stopColor="#e6683c" />
                  <stop offset="50%" stopColor="#dc2743" />
                  <stop offset="75%" stopColor="#cc2366" />
                  <stop offset="100%" stopColor="#bc1888" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="instagram-handle">@{teacher.instagramHandle}</span>
        </div>
      )}
    </div>
  )
}