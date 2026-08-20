function base64UrlEncode(
  buffer: ArrayBuffer | Uint8Array
) {
  const bytes =
    buffer instanceof Uint8Array
      ? buffer
      : new Uint8Array(buffer);

  return btoa(
    String.fromCharCode(...bytes)
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export async function generatePKCE() {
  // Generate random verifier
  const verifier = base64UrlEncode(
    crypto.getRandomValues(new Uint8Array(32))
  );

  // SHA256 hash
  const data = new TextEncoder().encode(
    verifier
  );

  const digest = await crypto.subtle.digest(
    "SHA-256",
    data
  );

  const challenge = base64UrlEncode(digest);

  // Store verifier temporarily
  sessionStorage.setItem(
    "pkce_verifier",
    verifier
  );

  return challenge;
}