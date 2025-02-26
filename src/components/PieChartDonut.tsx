"use client";

import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
// const chartData = [
//   { browser: "chrome", visitors: 275, fill: "hsl(var(--chart-1))" },
//   { browser: "safari", visitors: 200, fill: "hsl(var(--chart-2))" },
//   { browser: "firefox", visitors: 187, fill: "hsl(var(--chart-3))" },
//   { browser: "edge", visitors: 173, fill: "hsl(var(--chart-4))" },
//   { browser: "other", visitors: 90, fill: "hsl(var(--chart-5))" },
// ];

interface PieChartDonutProps {
  totalTasks: number;
  totalTodoTasks: number;
  totalInProgressTasks: number;
  totalDoneTasks: number;
}

export const PieChartDonut: React.FC<PieChartDonutProps> = ({
  totalTasks,
  totalTodoTasks,
  totalInProgressTasks,
  totalDoneTasks,
}) => {
  interface ChartData {
    browser: string;
    visitors: number;
    fill: string;
  }

  const [chartData, setChartData] = useState<ChartData[]>([]);
  useEffect(() => {
    setChartData([
      {
        browser: "À faire",
        visitors: totalTodoTasks,
        fill: "#c7d2fe",
      },
      {
        browser: "En cours",
        visitors: totalInProgressTasks,
        fill: "#fde68a",
      },
      {
        browser: "Terminées",
        visitors: totalDoneTasks,
        fill: "#bbf7d0",
      },
    ]);
  }, [totalTasks, totalTodoTasks, totalInProgressTasks, totalDoneTasks]);
  return (
    <Card className="flex flex-col">
      <h2 className="text-2xl font-semibold p-4">Activité</h2>
      {totalDoneTasks === 0 &&
      totalInProgressTasks === 0 &&
      totalTodoTasks === 0 ? (
        <div className="flex justify-center items-center p-10">
          <span className="text-3xl font-bold text-gray-300">
            Aucune Activité
          </span>
        </div>
      ) : (
        <div className="flex justify-evenly items-center flex-wrap">
          <div className="flex flex-col p-4">
            <div className="flex flex-col my-2 gap-2">
              <Badge className="font-bold bg-indigo-200 text-indigo-700 rounded-full">
                À faire 📝
              </Badge>
              <span className="text-3xl font-bold ">
                {totalTodoTasks}{" "}
                <span className="text-gray-300">/ {totalTasks}</span>
              </span>
            </div>
            <div className="flex flex-col my-2 gap-2">
              <Badge className="font-bold bg-amber-200 text-amber-700 rounded-full ">
                En cours 🚧{" "}
              </Badge>
              <span className="text-3xl font-bold">
                {totalInProgressTasks}{" "}
                <span className="text-gray-300">/ {totalTasks}</span>
              </span>
            </div>
            <div className="flex flex-col my-2 gap-2">
              <Badge className="font-bold bg-green-200 text-green-700 rounded-full">
                Terminées 🎉{" "}
              </Badge>
              <span className="text-3xl font-bold ">
                {totalDoneTasks}{" "}
                <span className="text-gray-300">/ {totalTasks}</span>
              </span>
            </div>
          </div>
          <CardContent className="flex flex-col p-0">
            <div className="flex justify-center items-center p-0">
              <PieChart width={300} height={300}>
                <Pie
                  data={chartData}
                  dataKey="visitors"
                  nameKey="browser"
                  innerRadius={60}
                  fill="#8884d8"
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {totalTasks}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Tâches
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </div>
          </CardContent>
        </div>
      )}
    </Card>
  );
};
