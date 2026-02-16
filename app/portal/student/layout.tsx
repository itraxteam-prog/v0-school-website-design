import { withAuth } from '@/backend/utils/withAuth';

export default async function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Server-side authentication check
    const user = await withAuth(['student']);

    return <>{children}</>;
}
