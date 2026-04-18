import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useLanguage } from "@/contexts/language";
import ZReportView from './ZReportView';
import InventoryValuationReport from './InventoryValuationReport';
import VoidCancellationReport from './VoidCancellationReport';
import InventoryManagementReport from './InventoryManagementReport';
import CommonLayout from '@/layouts/CommonLayout';
import { useAuth } from '@/contexts/authorize';
import type { IReport } from '@/types/reports';
import { reportApi } from '@/api';
import { LoggerUtils } from '@/utils';
import Loader from '@/components/Loader';
import SalesSummary from './SalesSummary';
import CustomerInsightsReport from './CustomerInsightsReport';
import FinancialOverviewReport from './FinancialOverviewReport';

// Registry of built report components
const REPORT_REGISTRY: Record<string, React.ComponentType<object>> = {
    'z_report': ZReportView,
    'inventory_valuation': InventoryValuationReport,
    'void_cancellation': VoidCancellationReport,
    'inventory_management': InventoryManagementReport,
    "sales_summary": SalesSummary,
    "customer_insights": CustomerInsightsReport,
    "financial_overview": FinancialOverviewReport
};

const DynamicReportPage = () => {
    const { page, version } = useParams<{ page: string; version: string; }>();
    const { info } = useAuth();
    const { t } = useLanguage();

    const [reports, setReports] = useState<IReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetched, setIsFetched] = useState(false); // New: Track if first fetch is done

    const userId = useMemo(() => info.authUser?.userId ?? 0, [info.authUser?.userId]);

    const fetchReports = useCallback(async () => {
        if (!userId) {
            setIsLoading(false);
            setIsFetched(true);
            return;
        }

        try {
            const response = await reportApi.getReports(userId);
            if (response.success && Array.isArray(response.data)) {
                setReports(response.data);
            }
        } catch (err) {
            LoggerUtils.logCatch(err, "DynamicReportPage.tsx", "fetchReports", `userId: ${userId}`);
        } finally {
            setIsLoading(false);
            setIsFetched(true);
        }
    }, [userId]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    // Validation Logic
    const validation = useMemo(() => {
        if (!page || !isFetched) return { isValid: true, component: null };

        // 1. Check if the report exists in the API response for this user
        const apiReport = reports.find(r => r.url.toLowerCase() === page.toLowerCase());

        // 2. Check if the report exists in our local Component Registry
        const RegisteredComponent = REPORT_REGISTRY[page.toLowerCase()];

        if (!apiReport || !RegisteredComponent) {
            return { isValid: false, component: null };
        }

        return { isValid: true, component: RegisteredComponent };
    }, [page, reports, isFetched]);

    // UI Logic
    if (isLoading) {
        return (
            <CommonLayout h1={t("navigation.report_label")}>
                <div className="p-10 flex justify-center items-center">
                   <Loader label={t("common.loading")} />
                </div>
            </CommonLayout>
        );
    }

    if (!validation.isValid) {
        return <Navigate to={`/404?version=${version}&page=${page}`} replace />;
    }

    const ActiveReport = validation.component;

    return (
        <CommonLayout h1={t("navigation.report_label")}>
            <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {ActiveReport && <ActiveReport />}
            </div>
        </CommonLayout>
    );
};

export default DynamicReportPage;