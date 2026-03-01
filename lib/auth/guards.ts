import type { Role, Plan } from "@/types/saaS";

export const roleRank: Record<Role, number> = {
  owner: 4,
  admin: 3,
  analyst: 2,
  viewer: 1
};

export function requireRole(userRole: Role, minRole: Role) {
  return roleRank[userRole] >= roleRank[minRole];
}

export const planTenderLimitPerMonth: Record<Plan, number> = {
  free: 3,
  pro: 25,
  enterprise: Number.POSITIVE_INFINITY
};
