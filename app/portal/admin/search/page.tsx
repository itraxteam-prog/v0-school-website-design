import { SearchManager } from "@/components/portal/search-manager"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export default async function AdminSearchPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-secondary">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        }>
            <SearchManager />
        </Suspense>
    )
}
