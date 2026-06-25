import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/auth/roles";

export default async function AdminKonselingLayout({ children }: { children: React.ReactNode }) {
  const role = await getUserRole();

  // Only super_admin and admin_konseling can access this section
  if (role !== "super_admin" && role !== "admin_konseling") {
    redirect("/admin");
  }

  return <>{children}</>;
}
