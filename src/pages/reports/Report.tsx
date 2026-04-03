import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonLayout from '@/layouts/CommonLayout';
import resource from "@/locales/en.json";
import { useAuth } from '@/contexts/authorize';
import { reportApi } from '@/api';
import { LoggerUtils } from '@/utils';
import FloatingAlert from '@/components/FloatingAlert';
import ChevronRightIcon from '@/libs/icons/ChevronRightIcon';
import type { IReport } from '@/types/reports';

const Report = () => {
    const { info } = useAuth();
    const navigate = useNavigate();

    const [reports, setReports] = useState<IReport[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const userId = useMemo(() => info.authUser?.userId ?? 0, [info.authUser?.userId]);

    const fetchReports = useCallback(async () => {
        if (!userId) {
            setError(resource.pos_t1.msg_invalid_user);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const response = await reportApi.getReports(userId);

            if (response.success && Array.isArray(response.data)) {
                setReports(response.data);
            } else {
                setError(response.message || resource.common.error);
            }
        } catch (err) {
            LoggerUtils.logCatch(err, "Report.tsx", "fetchReports", `userId: ${userId}`);
            setError(resource.common.error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    return (
        <CommonLayout h1={resource.navigation.report_label}>
            <div className="p-6 max-w-6xl mx-auto">
                {error && (
                    <FloatingAlert
                        type="error"
                        message={error}
                        onClose={() => setError(null)}
                    />
                )}

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-36 bg-white dark:bg-gray-800 animate-pulse rounded-md border border-gray-100 dark:border-gray-700" />
                        ))}
                    </div>
                ) : reports.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {reports.map((report) => (
                            <button
                                key={report.id}
                                onClick={() => navigate(`/report/${report.version}/${report.url}`)}
                                className="group flex flex-col text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-5 transition-colors hover:border-teal-500 active:scale-[0.98] shadow-sm hover:shadow-md"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h2 className="text-sm font-black uppercase tracking-tight text-gray-700 dark:text-gray-200 group-hover:text-teal-600 transition-colors">
                                        {report.name}
                                    </h2>
                                    <ChevronRightIcon className="w-4 h-4 text-gray-300 group-hover:text-teal-500 transition-transform group-hover:translate-x-1" />
                                </div>

                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium line-clamp-2 flex-grow">
                                    {report.description}
                                </p>
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase text-gray-400">
                                        {resource.reports.version.replace('{version}', report.version || '1.0')}
                                    </span>
                                    <span className="text-[9px] font-black uppercase text-teal-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
                                        {resource.common.open}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-md">
                        <p className="text-xs font-black uppercase text-gray-400 tracking-widest italic">
                            {resource.common.no_record}
                        </p>
                    </div>
                )}
            </div>
        </CommonLayout>
    );
};

export default Report;