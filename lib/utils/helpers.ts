export const getInitials = (
  firstName?: string,
  lastName?: string,
): string => {
  if (firstName && !lastName) {
    // Single name string like "John Doe"
    const parts = firstName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0]?.slice(0, 2).toUpperCase() ?? "??";
  }

  return `${firstName?.trim()?.[0] ?? ""}${lastName?.trim()?.[0] ?? ""}`.toUpperCase();
};
