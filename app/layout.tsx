import { Geist, Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { RestaurantProvider } from "@/lib/store"

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: "GourmetOS - Premium POS",
  description: "Next Generation POS and Restaurant Management",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <ThemeProvider>
          <RestaurantProvider>
            <div className="min-h-screen bg-background flex w-full flex-col">
              <Sidebar />
              <div className="flex flex-col lg:pl-64 min-h-screen">
                <Header />
                <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-x-hidden">
                  {children}
                </main>
              </div>
            </div>
          </RestaurantProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
