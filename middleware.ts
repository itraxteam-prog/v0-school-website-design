import { withAuth } from "next-auth/middleware";

export default withAuth(
    {
        callbacks: {
            authorized({ token, req }) {
                const publicRoutes = ["/portal/login", "/portal/forgot-password", "/portal/reset-password", "/portal/health"];
                if (publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) return true;
                return !!token;
            },
        },
        pages: { signIn: "/portal/login" },
        secret: process.env.NEXTAUTH_SECRET,
    }
);

export const config = {
    matcher: [
        "/portal/admin/:path*",
        "/portal/teacher/:path*",
        "/portal/student/:path*"
    ]
};
