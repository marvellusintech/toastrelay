function getServerEnv(name: string) {
  if (typeof window !== "undefined") {
    throw new Error(`Tried to read server env "${name}" in the browser.`);
  }

  return process.env[name];
}

export const serverEnv = {
  paystackSecretKey: getServerEnv("PAYSTACK_SECRET_KEY"),
  jwtSecret: getServerEnv("JWT_SECRET"),
};
