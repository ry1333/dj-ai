import { LucideIcon } from 'lucide-react'
import { GradientButton } from './ui/gradient-button'

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      <div className="w-20 h-20 rounded-full bg-surface border border-line flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-muted" strokeWidth={1.5} />
      </div>

      <h3 className="text-2xl font-bold text-text mb-2">{title}</h3>
      <p className="text-muted text-sm max-w-md mb-6">{description}</p>

      {actionLabel && onAction && (
        <GradientButton onClick={onAction} size="lg">
          {actionLabel}
        </GradientButton>
      )}
    </div>
  )
}
