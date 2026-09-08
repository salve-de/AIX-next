export type ProfileManagementCapability = { profileId?: string; token?: string; watchToken?: string };

/** Private bearer link. Never append these parameters to a public profile URL. */
export function profileManagementHref(capability: ProfileManagementCapability) {
  const params = new URLSearchParams();
  if (capability.profileId && capability.token) {
    params.set("profileId", capability.profileId);
    params.set("token", capability.token);
  }
  if (capability.watchToken) params.set("watchToken", capability.watchToken);
  return `/profile/manage${params.size ? `?${params}` : ""}`;
}
