
import React from 'react';
import { useSpacecraft } from '../hooks/useSpacecraft';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import WastePieChart from '../components/charts/WastePieChart';
import WasteBarChart from '../components/charts/WasteBarChart';
import Gauge from '../components/Gauge';
import { WasteType } from '../types';

const Inventory: React.FC = () => {
  const { wasteInventory, storageCapacity, storageUsed } = useSpacecraft();

  const plasticAmount = wasteInventory.filter(item => item.type === WasteType.Plastic).length;
  const filamentPrediction = (plasticAmount * 5).toFixed(0); // 1kg plastic = 5m filament

  return (
    <>
      <PageHeader title="Inventory & Stats" subtitle="Analyze waste collection data and trends." />
      
      {/* Prediction Banner */}
      <div className="bg-accent-blue/20 border border-accent-blue text-accent-blue p-4 rounded-lg mb-6 flex items-center animate-fadeIn">
        <span className="text-2xl mr-4">💡</span>
        <p>
          <span className="font-bold">Prediction:</span> With the current <span className="font-bold">{plasticAmount} kg</span> of plastic, you can recycle approximately <span className="font-bold">{filamentPrediction} meters</span> of 3D printer filament.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="Storage Capacity Used" className="lg:col-span-1">
          <Gauge value={(storageUsed / storageCapacity) * 100} label={`${storageUsed} / ${storageCapacity} kg`} />
        </Card>
        <Card title="Category Breakdown" className="lg:col-span-2">
          <WastePieChart data={wasteInventory} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card title="Daily Accumulation Trend (kg)">
          <WasteBarChart data={wasteInventory} />
        </Card>
        <Card title="Detailed Waste Log">
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-space-mid">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Waste Type</th>
                  <th className="p-3">Source</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-space-light">
                {wasteInventory.map(item => (
                  <tr key={item.id} className="hover:bg-space-light transition-colors">
                    <td className="p-3">{new Date(item.timestamp).toLocaleString()}</td>
                    <td className="p-3 font-semibold">{item.type}</td>
                    <td className="p-3 capitalize">{item.source}</td>
                    <td className="p-3 text-sm">
                      {item.source === 'scanner' && item.confidence && `Confidence: ${(item.confidence * 100).toFixed(0)}%`}
                      {item.correctedFrom && <span className="text-accent-yellow ml-2">(Corrected from {item.correctedFrom})</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Inventory;
