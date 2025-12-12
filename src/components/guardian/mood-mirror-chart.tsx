'use client';

import { Pie, PieChart, Cell } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';

const chartData = [
  { mood: 'Happy', count: 4, fill: 'var(--color-happy)' },
  { mood: 'Neutral', count: 2, fill: 'var(--color-neutral)' },
  { mood: 'Anxious', count: 1, fill: 'var(--color-anxious)' },
];

const chartConfig = {
  count: {
    label: 'Days',
  },
  happy: {
    label: 'Happy',
    color: 'hsl(var(--chart-2))',
  },
  neutral: {
    label: 'Neutral',
    color: 'hsl(var(--chart-3))',
  },
  anxious: {
    label: 'Anxious',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

export function MoodMirrorChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="mood"
          innerRadius={60}
          strokeWidth={5}
        >
            {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
