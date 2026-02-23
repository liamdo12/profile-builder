import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/shared/page-header'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { fetchAllUsers, updateUserRole } from '@/api/admin-api'
import type { AdminUserResponse } from '@/api/admin-api'
import type { UserRole } from '@/types/auth'

const ROLES: UserRole[] = ['BASIC', 'PREMIUM', 'ADMIN']

const roleBadgeVariant: Record<UserRole, 'default' | 'secondary' | 'destructive'> = {
  BASIC: 'secondary',
  PREMIUM: 'default',
  ADMIN: 'destructive',
}

export default function AdminUserManagementPage() {
  const [users, setUsers] = useState<AdminUserResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  useEffect(() => {
    fetchAllUsers()
      .then(setUsers)
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setIsLoading(false))
  }, [])

  async function handleRoleChange(userId: number, newRole: UserRole) {
    setUpdatingId(userId)
    try {
      const updated = await updateUserRole(userId, newRole)
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
      toast.success(`Role updated to ${newRole}`)
    } catch {
      toast.error('Failed to update role')
    } finally {
      setUpdatingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner label="Loading users..." />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle={`${users.length} registered user${users.length !== 1 ? 's' : ''}`}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-28">Role</TableHead>
              <TableHead className="w-40">Change Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-muted-foreground">{user.id}</TableCell>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={roleBadgeVariant[user.role]}>{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                    disabled={updatingId === user.id}
                  >
                    <SelectTrigger className="h-8 w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
