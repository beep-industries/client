interface MessageSkeletonProps {
  compact?: boolean
}

export default function MessageSkeleton({ compact = false }: MessageSkeletonProps) {
  return (
    <div className={`flex gap-3 px-4 ${compact ? "py-0.5" : "py-2"}`}>
      {!compact && <div className="bg-muted h-10 w-10 flex-shrink-0 animate-pulse rounded-full" />}
      <div className={`flex flex-1 flex-col gap-2 ${compact ? "ml-13" : ""}`}>
        {!compact && <div className="bg-muted h-4 w-24 animate-pulse rounded" />}
        <div
          className="bg-muted h-4 animate-pulse rounded"
          style={{ width: `${Math.random() * 40 + 40}%` }}
        />
      </div>
    </div>
  )
}
