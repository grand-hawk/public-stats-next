export const BRANCH_COOKIE = 'branch';

export function setBranchCookie(initials: string | null) {
  document.cookie = initials
    ? `${BRANCH_COOKIE}=${initials}; path=/; max-age=31536000; samesite=lax`
    : `${BRANCH_COOKIE}=; path=/; max-age=0; samesite=lax`;
}
