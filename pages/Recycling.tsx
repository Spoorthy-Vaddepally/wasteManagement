
import React from 'react';
import { useSpacecraft } from '../hooks/useSpacecraft';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import { RecycleProcess, RecycleJob, WasteType } from '../types';

const ProcessIcon = ({ process }: { process: RecycleProcess }) => {
    let icon = '⚙️';
    if (process.includes('Plastic')) icon = '♻️';
    if (process.includes('Textile')) icon = '👕';
    if (process.includes('Metal')) icon = '🔩';
    if (process.includes('Organic')) icon = '💧';
    return <span className="text-4xl">{icon}</span>;
}

const Recycling: React.FC = () => {
    const { recycleJobs, updateRecycleJob, startNewRecycleJob, wasteInventory } = useSpacecraft();

    const availableWaste = wasteInventory.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
    }, {} as Record<WasteType, number>);
    
    const isProcessDisabled = (process: RecycleProcess) => {
        if(process.includes('Plastic')) return !availableWaste.Plastic;
        if(process.includes('Textile')) return !availableWaste.Textile;
        if(process.includes('Metal')) return !availableWaste.Metal;
        if(process.includes('Organic')) return !availableWaste.Organic;
        return true;
    }

    const JobCard = ({ job }: { job: RecycleJob }) => {
        const color = job.status === 'running' ? 'bg-neon-green' : job.status === 'paused' ? 'bg-accent-yellow' : 'bg-gray-500';
        return (
            <div className="bg-space-light p-4 rounded-lg animate-fadeIn">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                        <ProcessIcon process={job.process} />
                        <div className="ml-4">
                            <h4 className="font-bold text-white">{job.process}</h4>
                            <p className="text-sm text-gray-400 capitalize">{job.status}</p>
                        </div>
                    </div>
                    <div className="text-xl font-bold">{job.progress}%</div>
                </div>
                <div className="w-full bg-space-dark rounded-full h-4 mb-3">
                    <div className={`${color} h-4 rounded-full transition-all duration-500`} style={{ width: `${job.progress}%` }}></div>
                </div>
                <div className="flex space-x-2">
                    {job.status === 'running' && (
                        <button onClick={() => updateRecycleJob(job.id, 'paused')} className="flex-1 bg-accent-yellow text-space-dark font-semibold py-2 px-3 rounded-md text-sm transition hover:scale-105">⏸ Pause</button>
                    )}
                    {job.status === 'paused' && (
                         <button onClick={() => updateRecycleJob(job.id, 'running')} className="flex-1 bg-neon-green text-space-dark font-semibold py-2 px-3 rounded-md text-sm transition hover:scale-105">▶ Resume</button>
                    )}
                     {(job.status === 'running' || job.status === 'paused') && (
                        <button onClick={() => updateRecycleJob(job.id, 'stopped')} className="flex-1 bg-accent-red text-white font-semibold py-2 px-3 rounded-md text-sm transition hover:scale-105">⏹ Emergency Stop</button>
                    )}
                </div>
            </div>
        )
    };
    
    const completedJobs = recycleJobs.filter(j => j.status === 'completed');
    const activeJobs = recycleJobs.filter(j => j.status !== 'completed');

    return (
        <>
            <PageHeader title="Recycling Process" subtitle="Monitor and control onboard recycling operations." />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Start New Recycling Job">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.values(RecycleProcess).map(process => (
                            <button key={process} 
                                    onClick={() => startNewRecycleJob(process)} 
                                    disabled={isProcessDisabled(process)}
                                    className="bg-space-light p-4 rounded-lg text-left hover:bg-space-dark disabled:bg-space-dark disabled:cursor-not-allowed disabled:opacity-50 transition flex items-center">
                                <ProcessIcon process={process} />
                                <span className="ml-4 font-semibold text-white">{process}</span>
                            </button>
                        ))}
                    </div>
                </Card>

                <Card title="Active Jobs">
                    {activeJobs.length > 0 ? (
                        <div className="space-y-4">
                            {activeJobs.map(job => <JobCard key={job.id} job={job} />)}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            No active recycling jobs.
                        </div>
                    )}
                </Card>
            </div>
            <div className="mt-8">
                <Card title="Completed Jobs Log">
                    {completedJobs.length > 0 ? (
                    <div className="overflow-x-auto max-h-64">
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-space-mid">
                                <tr>
                                    <th className="p-3">Process</th>
                                    <th className="p-3">Started</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-space-light">
                                {completedJobs.map(job => (
                                    <tr key={job.id}>
                                        <td className="p-3 font-semibold">{job.process}</td>
                                        <td className="p-3">{new Date(job.startTime).toLocaleString()}</td>
                                        <td className="p-3"><span className="text-neon-green font-semibold">Completed</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                           No completed jobs yet.
                        </div>
                    )}
                </Card>
            </div>
        </>
    );
};

export default Recycling;
