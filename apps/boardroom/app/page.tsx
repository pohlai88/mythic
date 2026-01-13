/**
 * Home Page
 *
 * Redirects to BoardRoom
 */

import { redirect } from "next/navigation"

export default function HomePage() {
  redirect("/boardroom")
}
