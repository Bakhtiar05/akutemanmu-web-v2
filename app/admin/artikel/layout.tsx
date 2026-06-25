import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/auth/roles";

export default async function AdminArtikelLayout({ children }: { children: React.ReactNode }) {
  const role = await getUserRole();

  // Only super_admin and admin_artikel can access this section
  if (role !== "super_admin" && role !== "admin_artikel") {
    redirect("/admin");
  }

  return <>{children}</>;
}
