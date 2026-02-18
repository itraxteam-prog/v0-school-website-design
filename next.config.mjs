/** @type {import('next').NextConfig} */
// #region agent log
if (process.env.CURSOR_DEBUG_SESSION === '62d8ff') {
  fetch('http://127.0.0.1:7319/ingest/c21559ae-6357-4698-af7f-3b7c9acdd88e', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '62d8ff' },
    body: JSON.stringify({
      sessionId: '62d8ff',
      runId: 'build-hang-1',
      hypothesisId: 'H2',
      location: 'next.config.mjs:2',
      message: 'nextConfig module evaluated',
      data: { hasCursorDebugSession: true },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
}
// #endregion agent log

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, ctx) => {
    // #region agent log
    if (process.env.CURSOR_DEBUG_SESSION === '62d8ff') {
      fetch('http://127.0.0.1:7319/ingest/c21559ae-6357-4698-af7f-3b7c9acdd88e', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '62d8ff' },
        body: JSON.stringify({
          sessionId: '62d8ff',
          runId: 'build-hang-2',
          hypothesisId: 'H3',
          location: 'next.config.mjs:webpack',
          message: 'nextConfig webpack hook called',
          data: { isServer: ctx?.isServer, nextRuntime: ctx?.nextRuntime },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
    }
    // #endregion agent log

    return config;
  },
}

export default nextConfig
