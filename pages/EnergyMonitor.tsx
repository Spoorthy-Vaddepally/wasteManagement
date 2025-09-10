
import React from 'react';
import { useSpacecraft } from '../hooks/useSpacecraft';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import EnergyLineChart from '../components/charts/EnergyLineChart';

const EnergyMonitor: React.FC = () => {
    const { energyLogs, recycleJobs } = useSpacecraft();

    const currentLog = energyLogs[energyLogs.length - 1] || { available: 0, consumed: 0 };
    const consumptionRate = recycleJobs.filter(j => j.status === 'running').length * 0.1; // 0.1 kWh per running job
    
    const getSystemHealth = (label: string, value: number, thresholds: { warn: number, danger: number }) => {
        let color = 'bg-neon-green';
        let status = 'Nominal';
        if (value > thresholds.warn) {
            color = 'bg-accent-yellow';
            status = 'Warning';
        }
        if (value > thresholds.danger) {
            color = 'bg-accent-red';
            status = 'Critical';
        }

        return (
            <div className="flex items-center justify-between p-3 bg-space-light rounded-lg">
                <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${color} mr-3 animate-pulse`}></div>
                    <span className="font-semibold">{label}</span>
                </div>
                <span className={`font-bold ${color.replace('bg-', 'text-')}`}>{status}</span>
            </div>
        );
    };

    const energyUsagePercentage = (currentLog.consumed / currentLog.available) * 100;

    return (
        <>
            <PageHeader title="Energy & System Monitor" subtitle="Oversee power distribution and system integrity." />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 animate-fadeIn">
                <div className="bg-space-mid border border-space-light rounded-lg p-6 text-center">
                    <div className="text-gray-400 mb-1">Current Available Energy</div>
                    <div className="text-4xl font-bold text-accent-blue">{currentLog.available.toFixed(1)} <span className="text-2xl">kWh</span></div>
                </div>
                <div className="bg-space-mid border border-space-light rounded-lg p-6 text-center">
                    <div className="text-gray-400 mb-1">Recycling Unit Consumption</div>
                    <div className="text-4xl font-bold text-neon-magenta">{consumptionRate.toFixed(2)} <span className="text-2xl">kWh</span></div>
                </div>
                 <div className="bg-space-mid border border-space-light rounded-lg p-6 text-center">
                    <div className="text-gray-400 mb-1">Total Consumption Today</div>
                    <div className="text-4xl font-bold text-accent-yellow">{currentLog.consumed.toFixed(1)} <span className="text-2xl">kWh</span></div>
                </div>
            </div>

            {energyUsagePercentage > 80 && (
                <div className="bg-accent-red/20 border border-accent-red text-accent-red p-4 rounded-lg mb-6 flex items-center">
                    <span className="text-2xl mr-4">⚠️</span>
                    <p>
                        <span className="font-bold">High Consumption Alert:</span> Energy usage is at {energyUsagePercentage.toFixed(1)}% of today's available total. Consider pausing non-essential operations.
                    </p>
                </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Energy Use Over Time (Last 7 Days)">
                        <EnergyLineChart data={energyLogs} />
                    </Card>
                </div>
                <div>
                    <Card title="System Health Indicators">
                        <div className="space-y-3">
                            {getSystemHealth('Power Grid', energyUsagePercentage, { warn: 75, danger: 90 })}
                            {getSystemHealth('Life Support', 25, { warn: 60, danger: 80 })}
                            {getSystemHealth('Recycling Unit', consumptionRate * 10, { warn: 50, danger: 75 })}
                            {getSystemHealth('Thermal Control', 40, { warn: 70, danger: 85 })}
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default EnergyMonitor;
