export default function AdminDashboardLoading() {
    return (
        <div className="p-6 space-y-6 animate-pulse">
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <div className="h-8 w-48 bg-slate-200 rounded"></div>
                <div className="h-10 w-32 bg-slate-200 rounded"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <div className="h-4 w-24 bg-slate-200 rounded mb-4"></div>
                        <div className="h-8 w-16 bg-slate-200 rounded"></div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-64">
                        <div className="h-6 w-32 bg-slate-200 rounded mb-6"></div>
                        <div className="space-y-4">
                            {[...Array(4)].map((_, j) => (
                                <div key={j} className="h-10 bg-slate-100 rounded"></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
