import { AdminLoginComponent } from "@/components/admin-login"
import { Metadata } from "next"

export default function LoginPage() {
  return <AdminLoginComponent />
}

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Login to access administrative features"
}
