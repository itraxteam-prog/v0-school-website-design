import { withAuth } from '@/backend/utils/withAuth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Server-side authentication check
    const user = await withAuth(['admin']);

    return <>{children}</>;
}
