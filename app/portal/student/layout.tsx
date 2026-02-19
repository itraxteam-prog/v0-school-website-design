import { withAuth } from '@/utils/mockAuth';

export default async function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Server-side authentication check
    const user = await withAuth(['student']);

    return <>{children}</>;
}
