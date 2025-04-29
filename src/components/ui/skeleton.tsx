
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  asSpan = false, // Add a prop to render as span
  ...props
}: React.HTMLAttributes<HTMLDivElement | HTMLSpanElement> & { asSpan?: boolean }) { // Update type
  const Component = asSpan ? 'span' : 'div'; // Choose component type

  return (
    <Component // Use the determined component type
      className={cn("animate-pulse rounded-md bg-muted/50", className)} // Slightly more transparent muted color
      {...props}
    />
  )
}

export { Skeleton }
