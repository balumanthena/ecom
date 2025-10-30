import type { Metadata } from "next"
import "./globals.css"
import Providers from "./providers"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "Royal Jewels",
  description: "Premium Imitation Jewelry Store",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />

          {/* ✅ This ensures the page content is visible and pushes footer down */}
          <main className="flex-1 container-px py-8">
            {children}
          </main>

          <Footer />
        </Providers>
      </body>
    </html>
  )
}
