import React from 'react';
import { Link } from 'react-router-dom';
import { useSpacecraft } from '../hooks/useSpacecraft';
import { WasteType, RecycleProcess } from '../types';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';

const Overview: React.FC = () => {
  const { missionDay, wasteInventory, recycleJobs, energyLogs } = useSpacecraft();

  const totalWaste = wasteInventory.length; // Assuming 1 item = 1kg
  const categoryBreakdown = wasteInventory.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<WasteType, number>);

  const recyclingOutputs = recycleJobs
    .filter(job => job.status === 'completed')
    .reduce((acc, job) => {
        let output = '';
        if (job.process === RecycleProcess.PlasticToFilament) output = 'Filament (m)';
        if (job.process === RecycleProcess.TextileToInsulation) output = 'Insulation Patches';
        if (job.process === RecycleProcess.MetalToComponent) output = 'Spare Parts';
        if (job.process === RecycleProcess.OrganicToGreywater) output = 'Greywater (L)';
        
        if (output) {
            acc[output] = (acc[output] || 0) + (output.includes('m') ? 50 : output.includes('L') ? 10 : 1); // Mock output amounts
        }
        return acc;
    }, {} as Record<string, number>);

  const todayEnergy = energyLogs[energyLogs.length - 1] || { available: 0, consumed: 0 };

  const StatCard = ({ label, value, unit, icon }: { label: string; value: string | number; unit: string; icon: string }) => (
    <div className="bg-space-light p-4 rounded-lg flex items-center animate-fadeIn">
      <div className="text-3xl mr-4">{icon}</div>
      <div>
        <div className="text-gray-400 text-sm">{label}</div>
        <div className="text-2xl font-bold text-white">{value} <span className="text-base font-normal">{unit}</span></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title={`Mission Day ${missionDay}`} subtitle="Welcome to the MIRIS Command Center" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Waste Collected" value={totalWaste} unit="kg" icon="🗑️" />
        <StatCard label="Energy Available" value={todayEnergy.available.toFixed(1)} unit="kWh" icon="🔋" />
        <StatCard label="Energy Consumed Today" value={todayEnergy.consumed.toFixed(1)} unit="kWh" icon="⚡" />
        <Link to="/crew/scanner" className="bg-neon-cyan hover:bg-cyan-400 text-space-dark font-bold p-4 rounded-lg flex items-center justify-center text-xl transition-transform transform hover:scale-105 animate-pulse">
            <span className="mr-3">🛰️</span> Start Waste Scan
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Waste Breakdown by Category" className="lg:col-span-1">
            <ul className="space-y-3 text-lg">
                {Object.values(WasteType).map(type => (
                    <li key={type} className="flex justify-between items-center">
                        <span className="text-gray-300">{type}</span>
                        <span className="font-semibold text-white bg-space-light px-3 py-1 rounded-md">{categoryBreakdown[type] || 0} kg</span>
                    </li>
                ))}
            </ul>
        </Card>

        <Card title="Cumulative Recycling Outputs" className="lg:col-span-2">
            {Object.keys(recyclingOutputs).length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Object.entries(recyclingOutputs).map(([name, value]) => (
                        <div key={name} className="bg-space-dark p-4 rounded-lg text-center">
                            <div className="text-3xl font-bold text-neon-cyan">{value}</div>
                            <div className="text-sm text-gray-400">{name}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                    No recycling outputs yet.
                </div>
            )}
        </Card>
      </div>
    </>
  );
};

export default Overview;