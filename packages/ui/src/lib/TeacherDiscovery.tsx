import * as React from 'react'
import { HotTeacherCard, HotTeacherProfile } from './HotTeacherCard'

export type TeacherDiscoveryProps = {
  teachers: HotTeacherProfile[]
  maxSelection?: number
  onSubmitSelection?: (selectedIds: string[]) => void
}

export const TeacherDiscovery: React.FC<TeacherDiscoveryProps> = ({
  teachers,
  maxSelection = 3,
  onSubmitSelection
}) => {
  const [selectedTeachers, setSelectedTeachers] = React.useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = React.useState<'grid' | 'stack'>('stack')
  
  const handleToggleTeacher = (teacherId: string) => {
    setSelectedTeachers(prev => {
      const next = new Set(prev)
      if (next.has(teacherId)) {
        next.delete(teacherId)
      } else if (next.size < maxSelection) {
        next.add(teacherId)
      }
      return next
    })
  }
  
  const canSubmit = selectedTeachers.size > 0
  
  return (
    <div className="teacher-discovery">
      <header className="teacher-discovery__header">
        <div className="teacher-discovery__title-section">
          <h1>Find Your Flow</h1>
          <p>Select up to {maxSelection} instructors for your personalized yoga journey</p>
        </div>
        
        <div className="teacher-discovery__controls">
          <div className="view-toggle">
            <button 
              className={viewMode === 'stack' ? 'active' : ''}
              onClick={() => setViewMode('stack')}
            >
              Stack
            </button>
            <button 
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
          </div>
        </div>
      </header>
      
      <div className={`teacher-discovery__content teacher-discovery__content--${viewMode}`}>
        {teachers.map(teacher => (
          <HotTeacherCard
            key={teacher.id}
            teacher={teacher}
            isSelected={selectedTeachers.has(teacher.id)}
            onSelect={() => handleToggleTeacher(teacher.id)}
            compact={viewMode === 'grid'}
          />
        ))}
      </div>
      
      {selectedTeachers.size > 0 && (
        <div className="teacher-discovery__selection-bar">
          <div className="selection-info">
            <span className="count">{selectedTeachers.size} of {maxSelection} selected</span>
            <div className="selected-handles">
              {Array.from(selectedTeachers).map(id => {
                const teacher = teachers.find(t => t.id === id)
                return teacher ? (
                  <span key={id} className="handle-chip">
                    @{teacher.handle}
                    <button onClick={() => handleToggleTeacher(id)}>×</button>
                  </span>
                ) : null
              })}
            </div>
          </div>
          
          <button 
            className="submit-btn"
            onClick={() => onSubmitSelection?.(Array.from(selectedTeachers))}
            disabled={!canSubmit}
          >
            Create Escrow for {selectedTeachers.size} Teacher{selectedTeachers.size !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  )
}