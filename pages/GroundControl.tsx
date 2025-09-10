import React from 'react';
import { Link } from 'react-router-dom';
import { useSpacecraft } from '../hooks/useSpacecraft';
import Card from '../components/Card';
import { WasteType } from '../types';
import WastePieChart from '../components/charts/WastePieChart';
import EnergyLineChart from '../components/charts/EnergyLineChart';
import Gauge from '../components/Gauge';

const GroundControl: React.FC = () => {
    const { missionDay, wasteInventory, recycleJobs, energyLogs, storageCapacity, storageUsed } = useSpacecraft();

    const categoryBreakdown = wasteInventory.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
    }, {} as Record<WasteType, number>);

    const totalRecycledItems = recycleJobs.filter(j => j.status === 'completed').length;
    
    const StatDisplay = ({ label, value }: { label: string, value: string | number }) => (
        <div className="bg-space-light p-4 rounded-lg text-center">
            <div className="text-gray-400 text-sm">{label}</div>
            <div className="text-2xl font-bold text-white">{value}</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-space-dark font-sans p-4 sm:p-6 md:p-8">
            <header className="flex justify-between items-center mb-6 animate-fadeIn border-b border-space-light pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Ground Control Monitoring</h1>
                    <p className="text-gray-400">Read-only dashboard for MIRIS on Mission Day {missionDay}.</p>
                </div>
                <Link to="/crew" className="bg-accent-blue hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg transition">
                    Return to Crew UI
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatDisplay label="Total Waste (kg)" value={wasteInventory.length} />
                <StatDisplay label="Items Recycled" value={totalRecycledItems} />
                <StatDisplay label="Active Recycle Jobs" value={recycleJobs.filter(j => j.status === 'running').length} />
                <StatDisplay label="Storage Used" value={`${storageUsed} / ${storageCapacity} kg`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    <Card title="Energy Usage and Efficiency Logs">
                        <EnergyLineChart data={energyLogs} />
                    </Card>
                    <Card title="Waste Inventory Levels by Category (kg)">
                         <ul className="space-y-3 text-lg">
                            {Object.values(WasteType).map(type => (
                                <li key={type} className="flex justify-between items-center p-2 bg-space-dark rounded-md">
                                    <span className="text-gray-300">{type}</span>
                                    <span className="font-semibold text-white bg-space-light px-3 py-1 rounded-md">{categoryBreakdown[type] || 0}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-6">
                     <Card title="Storage Capacity">
                        <Gauge value={(storageUsed/storageCapacity)*100} label="Capacity Filled"/>
                    </Card>
                    <Card title="Waste Category Breakdown (%)">
                        <WastePieChart data={wasteInventory} />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default GroundControl;