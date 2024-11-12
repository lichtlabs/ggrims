import { AdminDashboardComponent } from "@/components/admin-dashboard"
import { Metadata } from "next"

export default function DashboardPage() {
  return <AdminDashboardComponent />
}

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage your organization's events and activities"
}
