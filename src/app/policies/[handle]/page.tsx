import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Policy, policyByHandle } from "@/components/policy/policy";
import { themeCookieName, themeFromCookie } from "@/lib/theme-cookie";

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const policy = policyByHandle(handle);
  if (!policy) notFound();

  const jar = await cookies();
  return <Policy handle={policy.handle} theme={themeFromCookie(jar.get(themeCookieName)?.value)} />;
}
