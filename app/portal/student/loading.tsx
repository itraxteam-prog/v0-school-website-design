export default function StudentDashboardLoading() {
    return (
        <div className="p-6 space-y-6 animate-pulse">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="h-8 w-56 bg-slate-200 rounded mb-4"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="text-center">
                                <div className="h-4 w-16 bg-slate-100 rounded mx-auto mb-2"></div>
                                <div className="h-6 w-12 bg-slate-200 rounded mx-auto"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-64">
                        <div className="h-6 w-40 bg-slate-200 rounded mb-6"></div>
                        <div className="h-full bg-slate-50 rounded"></div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <div className="h-6 w-32 bg-slate-200 rounded mb-4"></div>
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-12 bg-slate-50 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-48">
                        <div className="h-6 w-32 bg-slate-200 rounded mb-4"></div>
                        <div className="h-24 bg-slate-50 rounded"></div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-64">
                        <div className="h-6 w-32 bg-slate-200 rounded mb-4"></div>
                        <div className="space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-8 bg-slate-50 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
