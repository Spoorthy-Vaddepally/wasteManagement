
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EnergyLog } from '../../types';

interface EnergyLineChartProps {
  data: EnergyLog[];
}

const EnergyLineChart: React.FC<EnergyLineChartProps> = ({ data }) => {
    const formattedData = data.map(log => ({
        ...log,
        date: new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={formattedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
        <XAxis dataKey="date" stroke="#9CA3AF" />
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
        <Line type="monotone" dataKey="available" name="Available (kWh)" stroke="#38BDF8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="consumed" name="Consumed (kWh)" stroke="#F472B6" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EnergyLineChart;
