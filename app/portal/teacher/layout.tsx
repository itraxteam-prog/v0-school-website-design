import { withAuth } from '@/utils/mockAuth';

export default async function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Server-side authentication check
    const user = await withAuth(['teacher']);

    return <>{children}</>;
}
