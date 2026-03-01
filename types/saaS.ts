export type Role = "owner" | "admin" | "analyst" | "viewer";
export type Plan = "free" | "pro" | "enterprise";

export type Org = {
  id: string;
  name: string;
  plan: Plan;
  created_at: string;
};

export type UserProfile = {
  id: string;
  org_id: string;
  role: Role;
  created_at: string;
};
