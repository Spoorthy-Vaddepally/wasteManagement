import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WasteItem } from '../../types';
import { WASTE_COLORS } from '../../constants';

interface WastePieChartProps {
  data: WasteItem[];
}

const WastePieChart: React.FC<WastePieChartProps> = ({ data }) => {
  const chartData = Object.entries(
    data.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number })
  ).map(([name, value]) => ({ name, value }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={110}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          // FIX: Add 'any' type to label props to resolve TypeScript error where 'percent' was not found on the inferred type.
          label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={WASTE_COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(22, 27, 34, 0.8)',
            borderColor: '#21262D',
            borderRadius: '0.5rem',
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default WastePieChart;
