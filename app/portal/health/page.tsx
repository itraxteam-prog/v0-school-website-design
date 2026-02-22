export const dynamic = "force-dynamic";

export default function HealthPage() {
    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Portal Health Check</h1>
            <p>If you can see this, the /portal/ route group is being built and accessed correctly.</p>
            <p>Time: {new Date().toISOString()}</p>
        </div>
    );
}
