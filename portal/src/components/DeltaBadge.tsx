import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface DeltaBadgeProps {
  value: number
  label?: string
  format?: 'number' | 'percent' | 'points'
  invert?: boolean // for position (lower is better)
}

export function DeltaBadge({ value, label, format = 'number', invert = false }: DeltaBadgeProps) {
  const isPositive = invert ? value < 0 : value > 0
  const isNegative = invert ? value > 0 : value < 0
  const isZero = value === 0

  const formatted =
    format === 'percent' ? `${value > 0 ? '+' : ''}${value.toFixed(1)}%` :
    format === 'points'  ? `${value > 0 ? '+' : ''}${value} pts` :
                           `${value > 0 ? '+' : ''}${value}`

  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-xs font-medium',
      isPositive && 'text-emerald-600 dark:text-emerald-400',
      isNegative && 'text-red-600 dark:text-red-400',
      isZero     && 'text-slate-400',
    )}>
      {isPositive && <TrendingUp className="h-3 w-3" />}
      {isNegative && <TrendingDown className="h-3 w-3" />}
      {isZero     && <Minus className="h-3 w-3" />}
      {formatted}
      {label && <span className="text-muted-foreground font-normal ml-0.5">{label}</span>}
    </span>
  )
}

export function ScoreDelta({ before, after }: { before: number | null; after: number | null }) {
  if (before == null || after == null) return <span className="text-muted-foreground text-sm">—</span>
  const delta = after - before
  return (
    <span className="flex items-center gap-1.5 text-sm">
      <span className="text-muted-foreground">{before}</span>
      <span className="text-muted-foreground">→</span>
      <span className="font-semibold">{after}</span>
      <DeltaBadge value={delta} format="points" />
    </span>
  )
}
