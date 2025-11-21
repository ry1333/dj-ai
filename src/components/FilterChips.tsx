type FilterChipsProps = {
  activeFilters: {
    level: string | null
    duration: string | null
    topic: string | null
  }
  onFilterChange: (filterType: 'level' | 'duration' | 'topic', value: string | null) => void
}

export function FilterChips({ activeFilters, onFilterChange }: FilterChipsProps) {
  const levels = ['Beginner', 'Intermediate', 'Advanced']
  const durations = ['2m', '3m', '5m+']
  const topics = ['BPM', 'EQ', 'Filters', 'Keys', 'Structure']

  const chipClasses = (isActive: boolean) =>
    `px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
      isActive
        ? 'bg-gradient-to-r from-accentFrom to-accentTo text-ink border-transparent'
        : 'border border-line text-muted hover:border-line/50 hover:bg-white/5'
    }`

  return (
    <div className="space-y-3">
      {/* Level filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted font-semibold uppercase tracking-wider mr-2">
          Level:
        </span>
        {levels.map((level) => (
          <button
            key={level}
            onClick={() =>
              onFilterChange('level', activeFilters.level === level ? null : level)
            }
            className={chipClasses(activeFilters.level === level)}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Duration filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted font-semibold uppercase tracking-wider mr-2">
          Duration:
        </span>
        {durations.map((duration) => (
          <button
            key={duration}
            onClick={() =>
              onFilterChange('duration', activeFilters.duration === duration ? null : duration)
            }
            className={chipClasses(activeFilters.duration === duration)}
          >
            {duration}
          </button>
        ))}
      </div>

      {/* Topic filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted font-semibold uppercase tracking-wider mr-2">
          Topic:
        </span>
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() =>
              onFilterChange('topic', activeFilters.topic === topic ? null : topic)
            }
            className={chipClasses(activeFilters.topic === topic)}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Clear all button */}
      {(activeFilters.level || activeFilters.duration || activeFilters.topic) && (
        <button
          onClick={() => {
            onFilterChange('level', null)
            onFilterChange('duration', null)
            onFilterChange('topic', null)
          }}
          className="text-xs text-muted hover:text-text underline transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  )
}
