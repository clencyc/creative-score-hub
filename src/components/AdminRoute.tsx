import { useAdmin } from '@/hooks/useAdmin'
import { Navigate } from 'react-router-dom'

interface AdminRouteProps {
  children: React.ReactNode
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { hasAdminAccess, loading } = useAdmin()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!hasAdminAccess) {
    // Redirect to user dashboard if not admin
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
