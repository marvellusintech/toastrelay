/**
 * Utility options for the formatDate function
 */
type FormatStyle = 'display' | 'short' | 'relative';

/**
 * Formats a date string, number, or Date object into beautiful layouts matching Toastrelay's design requirements.
 */
export function formatDate(
  dateInput: Date | string | number | undefined | null,
  style: FormatStyle = 'display'
): string {
  if (!dateInput) return '';

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  
  // Guard against invalid dates
  if (isNaN(date.getTime())) return '';

  // 1. Display Format: "MAY 22, 2026" (Perfect for high-impact cinematic section titles)
  if (style === 'display') {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
      .format(date)
      .toUpperCase(); 
  }

  // 2. Short Format: "05/22/2026" (Perfect for dense analytical tables or receipts)
  if (style === 'short') {
    return new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(date);
  }

  // 3. Relative Format: "2 mins ago" / "Just now" (Perfect for real-time live toast notifications)
  if (style === 'relative') {
    const now = new Date();
    const secondsDiff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (secondsDiff < 10) return 'JUST NOW';
    if (secondsDiff < 60) return `${secondsDiff}s ago`;

    const minutesDiff = Math.floor(secondsDiff / 60);
    if (minutesDiff < 60) return `${minutesDiff}m ago`;

    const hoursDiff = Math.floor(minutesDiff / 60);
    if (hoursDiff < 24) return `${hoursDiff}h ago`;

    const daysDiff = Math.floor(hoursDiff / 24);
    if (daysDiff === 1) return 'YESTERDAY';
    if (daysDiff < 7) return `${daysDiff}d ago`;

    // Fall back to display format if older than a week
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    })
      .format(date)
      .toUpperCase();
  }

  return '';
}