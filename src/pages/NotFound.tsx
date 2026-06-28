import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { paths } from '@/routes/paths'

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
      <p className="text-7xl font-bold text-primary">404</p>
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link to={paths.dashboardPurchase} className={buttonVariants()}>
        Back to Dashboard
      </Link>
    </div>
  )
}
