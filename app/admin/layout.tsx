import type { ReactNode } from "react";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F7F3]">
      <AdminSidebar />

      <main className="min-h-screen pt-16 lg:ml-[260px] lg:pt-0">
        {children}
      </main>
    </div>
  );
}