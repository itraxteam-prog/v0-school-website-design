import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-[100dvh] overflow-x-hidden">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    )
}
