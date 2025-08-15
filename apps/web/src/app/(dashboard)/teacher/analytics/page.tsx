"use client";
import { DataCard } from "@/features/user/course/components/card/DataCard";
import { Chart } from "@/features/user/course/components/charts/Chart";
import useGetAnalytics from "@/features/user/course/hooks/useGetAnalytics";
import { Loader2 } from "lucide-react";

const AnalyticsPage = () => {
  const { data, isLoading } = useGetAnalytics();

  if (isLoading)
    return (
      <>
        <Loader2 className="animate-spin" />
      </>
    );

  return (
    <div className="p-6">
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <DataCard
          label="Total Revenue"
          value={data?.totalRevenue || 0}
          shouldFormat
        />
        <DataCard
          label="Total Sales"
          value={data?.totalSales || 0}
          shouldFormat={false}
        />
      </div>
      <Chart data={data?.data||[]} />
    </div>
  );
};

export default AnalyticsPage;
