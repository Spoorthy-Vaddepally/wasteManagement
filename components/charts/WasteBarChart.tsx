
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WasteItem, WasteType } from '../../types';
import { WASTE_COLORS } from '../../constants';
import { MOCK_MISSION_START_DATE } from '../../constants';

interface WasteBarChartProps {
  data: WasteItem[];
}

const WasteBarChart: React.FC<WasteBarChartProps> = ({ data }) => {
    const dailyData = data.reduce((acc, item) => {
        const date = new Date(item.timestamp).toISOString().split('T')[0];
        if (!acc[date]) {
            acc[date] = { date, [WasteType.Plastic]: 0, [WasteType.Metal]: 0, [WasteType.Textile]: 0, [WasteType.Organic]: 0 };
        }
        acc[date][item.type] = (acc[date][item.type] || 0) + 1;
        return acc;
    }, {} as { [key: string]: any });
    
    const chartData = Object.values(dailyData)
      .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(d => ({
        ...d,
        name: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })
      }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
        <XAxis dataKey="name" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip
            contentStyle={{
                backgroundColor: 'rgba(22, 27, 34, 0.8)',
                borderColor: '#21262D',
                borderRadius: '0.5rem',
            }}
            labelStyle={{ color: '#E5E7EB' }}
        />
        <Legend />
        <Bar dataKey={WasteType.Plastic} stackId="a" fill={WASTE_COLORS.Plastic} />
        <Bar dataKey={WasteType.Metal} stackId="a" fill={WASTE_COLORS.Metal} />
        <Bar dataKey={WasteType.Textile} stackId="a" fill={WASTE_COLORS.Textile} />
        <Bar dataKey={WasteType.Organic} stackId="a" fill={WASTE_COLORS.Organic} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WasteBarChart;
