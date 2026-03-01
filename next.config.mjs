import { withSentryConfig } from "@sentry/nextjs";
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    compress: true,
    poweredByHeader: false,
    productionBrowserSourceMaps: false,
    // @react-pdf/renderer and its sub-packages are ESM-only; Next.js must transpile them.
    transpilePackages: [
        "@react-pdf/renderer",
        "@react-pdf/font",
        "@react-pdf/image",
        "@react-pdf/layout",
        "@react-pdf/pdfkit",
        "@react-pdf/primitives",
        "@react-pdf/stylesheet",
        "@react-pdf/textkit",
        "@react-pdf/fns",
    ],
    experimental: {
        instrumentationHook: true,
    },
    webpack: (config) => {
        config.cache = false;
        return config;
    },
    async rewrites() {
        return [
            {
                source: "/login",
                destination: "/portal/login",
            },
            {
                source: "/register",
                destination: "/portal/register",
            },
            {
                source: "/forgot-password",
                destination: "/portal/forgot-password",
            },
            {
                source: "/reset-password",
                destination: "/portal/reset-password",
            },
        ];
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    { key: "X-Frame-Options", value: "DENY" },
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    { key: "X-DNS-Prefetch-Control", value: "on" },
                    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
                    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
                    {
                        key: "Content-Security-Policy",
                        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https://*.sentry.io; font-src 'self' data:; frame-ancestors 'none'; upgrade-insecure-requests;"
                    },
                ],
            },
        ];
    },
};

export default bundleAnalyzer(withSentryConfig(
    nextConfig,
    {
        // For all available options, see:
        // https://github.com/getsentry/sentry-webpack-plugin#options

        // Suppresses source map uploading logs during bundling
        silent: true,
        // org: "your-org",
        // project: "your-project",
    },
    {
        // For all available options, see:
        // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

        // Upload a larger set of source maps for prettier stack traces (increases build time)
        widenClientFileUpload: true,

        // Transpiles SDK to be compatible with IE11 (increases bundle size)
        transpileClientSDK: true,

        // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
        tunnelRoute: "/monitoring",

        // Hides source maps from visitors
        hideSourceMaps: true,

        // Automatically tree-shake Sentry logger statements to reduce bundle size
        disableLogger: true,

        // Enables automatic instrumentation of Vercel Cron Monitors.
        // See the following for more information:
        // https://docs.sentry.io/product/crons/
        // https://vercel.com/docs/cron-jobs
        automaticVercelMonitors: true,
    }
));

