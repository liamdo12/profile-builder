/**
 * RequireRole — restricts access to routes based on user role.
 * Redirects to / if the authenticated user's role is not in the allowed list.
 * Must be used inside a ProtectedRoute (user is guaranteed non-null here).
 */
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/use-auth';
import type { UserRole } from '../../types/auth';

interface RequireRoleProps {
  allowed: UserRole[];
  children: ReactNode;
}

export function RequireRole({ allowed, children }: RequireRoleProps) {
  const { user } = useAuth();

  if (!user || !allowed.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
