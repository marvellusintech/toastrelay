import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { HomeView } from "./_components/HomeView";

export default async function DefaultPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const isAuthenticated = Boolean(token);

  return <HomeView initialIsAuthenticated={isAuthenticated} />;
}

