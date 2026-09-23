import type { UserRole } from '@/types/user';

export function isUserRole(value: string | string[] | undefined): value is UserRole {
  return value === 'client' || value === 'barber';
}
