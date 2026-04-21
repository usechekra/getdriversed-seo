export type Role = 'VIEWER' | 'CONTRIBUTOR' | 'MANAGER' | 'ADMIN'

export const ROLE_LEVELS: Record<Role, number> = {
  VIEWER: 1,
  CONTRIBUTOR: 2,
  MANAGER: 3,
  ADMIN: 4,
}

export function hasRole(userRole: string, required: Role): boolean {
  return (ROLE_LEVELS[userRole as Role] ?? 0) >= ROLE_LEVELS[required]
}

export function isAdmin(role: string) { return hasRole(role, 'ADMIN') }
export function isManager(role: string) { return hasRole(role, 'MANAGER') }
export function isContributor(role: string) { return hasRole(role, 'CONTRIBUTOR') }
