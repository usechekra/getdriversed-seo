import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  QUEUED:        { label: 'Queued',         className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' },
  IN_PROGRESS:   { label: 'In Progress',    className: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
  READY_FOR_DEV: { label: 'Ready for Dev',  className: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
  IMPLEMENTED:   { label: 'Implemented',    className: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
  COMPLETED:     { label: 'Completed',      className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
  ARCHIVED:      { label: 'Archived',       className: 'bg-slate-50 text-slate-400 dark:bg-slate-900 dark:text-slate-500 border-slate-100 dark:border-slate-800' },
}

export function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, className: '' }
  return (
    <Badge variant="outline" className={cn('text-[11px] font-medium px-2 py-0.5 whitespace-nowrap', cfg.className)}>
      {cfg.label}
    </Badge>
  )
}
