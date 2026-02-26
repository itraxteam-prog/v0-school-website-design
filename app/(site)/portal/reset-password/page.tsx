import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-secondary">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm font-medium text-muted-foreground">Loading password reset...</p>
                </div>
            </div>
        }>
            <ResetPasswordClient />
        </Suspense>
    );
}
