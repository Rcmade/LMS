"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { GetTeacherAnalyticsApiT } from "@workspace/types";
import { Card } from "@workspace/ui/components/card";

interface ChartProps {
  data: GetTeacherAnalyticsApiT["res"]["data"];
}

export const Chart = ({ data }: ChartProps) => {
  return (
    <Card>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: string) => `$${value}`}
          />
          <Bar
            dataKey="total"
            fill="#8884d8"
            barSize={20}
            radius={[4, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
