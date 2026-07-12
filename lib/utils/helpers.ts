

export const getInitials = (
  firstName?: string,
  lastName?: string
): string => {
  return `${firstName?.trim()?.[0] ?? ""}${lastName?.trim()?.[0] ?? ""}`
    .toUpperCase();
};