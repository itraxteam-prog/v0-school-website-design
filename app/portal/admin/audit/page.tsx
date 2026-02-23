import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
    const logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
            user: { select: { email: true, role: true } },
        },
    });

    return (
        <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Audit Logs</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Track and monitor critical system actions and user activities.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-100 dark:border-blue-800">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Live Monitoring
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-bottom border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Time</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">User</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Action</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Entity</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Metadata</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 italic">
                                        No activity logs found.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                            {format(log.createdAt, "MMM d, HH:mm:ss")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                    {log.user?.email || "System"}
                                                </span>
                                                {log.user?.role && (
                                                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                                                        {log.user.role}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${log.action.includes("DELETE")
                                                ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                                : log.action.includes("UPDATE")
                                                    ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                                                    : "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                                }`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{log.entity}</span>
                                                {log.entityId && (
                                                    <span className="text-xs text-slate-400 font-mono">{log.entityId}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <pre className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded max-w-xs overflow-hidden text-ellipsis">
                                                {JSON.stringify(log.metadata, null, 2)}
                                            </pre>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
