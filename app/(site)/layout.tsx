import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </>
    )
}
