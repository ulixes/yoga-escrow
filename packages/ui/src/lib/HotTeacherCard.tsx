import * as React from 'react'

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
  
  return (
    <div 
      className={`hot-teacher-card ${isSelected ? 'selected' : ''} ${compact ? 'compact' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.()}
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
    </div>
  )
}