import React from 'react';
import { useSpacecraft } from '../hooks/useSpacecraft';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import { LogEntry } from '../types';

const Logs: React.FC = () => {
    const { systemLogs, wasteInventory, recycleJobs, energyLogs } = useSpacecraft();

    const handleExport = (format: 'json') => {
        const fullData = {
            wasteInventory,
            recycleJobs,
            energyLogs,
            systemLogs,
            exportTimestamp: new Date().toISOString()
        };
        const dataStr = JSON.stringify(fullData, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
        const exportFileDefaultName = `MIRIS_Log_${new Date().toISOString()}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const LogRow = ({ log }: { log: LogEntry }) => {
        let icon = 'ℹ️';
        let color = 'text-gray-400';
        if (log.type === 'success') {
            icon = '✅';
            color = 'text-neon-green';
        }
        if (log.type === 'warning') {
            icon = '⚠️';
            color = 'text-accent-yellow';
        }
        if (log.type === 'error') {
            icon = '🛑';
            color = 'text-accent-red';
        }

        return (
            <tr className="hover:bg-space-light transition-colors">
                <td className="p-3 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                <td className={`p-3 font-semibold ${color}`}>
                    <span className="mr-2">{icon}</span>
                    <span className="capitalize">{log.type}</span>
                </td>
                <td className="p-3">{log.message}</td>
            </tr>
        )
    };

    return (
        <>
            <PageHeader title="Logs & History" subtitle="Review the full event history of system operations." />
            
            <Card title="Full Event History">
                <div className="flex justify-end mb-4">
                    <button 
                        onClick={() => handleExport('json')}
                        className="bg-accent-blue hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg transition"
                    >
                        Export Logs as JSON
                    </button>
                </div>
                <div className="overflow-x-auto max-h-[60vh]">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 bg-space-mid">
                            <tr>
                                <th className="p-3">Timestamp</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Message</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-space-light">
                            {systemLogs.length > 0 ? (
                                systemLogs.map(log => <LogRow key={log.id} log={log} />)
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center p-6 text-gray-500">No system logs recorded yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </>
    );
};

export default Logs;