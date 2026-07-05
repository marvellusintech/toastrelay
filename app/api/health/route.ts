import { publicEnv } from "@/lib/env/public";
import { serverEnv } from "@/lib/env/server";

export async function GET() {
  return Response.json({
    ok: true,
    apiBaseUrl: publicEnv.apiBaseUrl,
    serverEnv: {
      paystackConfigured: Boolean(serverEnv.paystackSecretKey),
      jwtConfigured: Boolean(serverEnv.jwtSecret),
    },
  });
}
