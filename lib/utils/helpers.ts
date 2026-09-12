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


export const numberWithCommas = (
  x: number | string,
  decimalPlaces: number = 2
): string => {
  if (
    typeof x === "number" ||
    (typeof x === "string" && !isNaN(Number(x)))
  ) {
    const num = Number(x);
    const roundedNum = num.toFixed(decimalPlaces);

    const [integerPart = "0", fractionalPart = "0"] =
      roundedNum.split(".");

    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    );

    return Number(fractionalPart) > 0
      ? `${formattedIntegerPart}.${fractionalPart}`
      : formattedIntegerPart;
  }

  return String(x);
};

export const formatNumberWithCommas = numberWithCommas;
// export const useNumberWithCommas = numberWithCommas;