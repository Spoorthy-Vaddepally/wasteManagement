
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    return (
      <motion.span 
        className="text-4xl"
        animate={{ 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        {icon}
      </motion.span>
    );
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
        let color = 'bg-gray-500';
        let glowColor = 'rgba(107, 114, 128, 0.5)';
        
        if (job.status === 'running') {
          color = 'bg-gradient-to-r from-neon-green to-accent-blue';
          glowColor = 'rgba(57, 255, 20, 0.5)';
        } else if (job.status === 'paused') {
          color = 'bg-gradient-to-r from-accent-orange to-neon-orange';
          glowColor = 'rgba(255, 69, 0, 0.5)';
        }
        
        return (
            <motion.div 
              className="bg-gradient-to-br from-space-light/80 to-space-mid/60 backdrop-blur-sm border border-accent-blue/30 p-4 rounded-xl shadow-hologram relative overflow-hidden group"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 15px 35px rgba(0, 191, 255, 0.2)"
              }}
            >
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-hologram opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <motion.div 
                  className="flex items-center justify-between mb-3 relative z-10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <div className="flex items-center">
                        <ProcessIcon process={job.process} />
                        <div className="ml-4">
                            <h4 className="font-bold text-white">{job.process}</h4>
                            <motion.p 
                              className="text-sm text-gray-300 capitalize flex items-center"
                              animate={job.status === 'running' ? { opacity: [0.7, 1, 0.7] } : {}}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <motion.span 
                                className={`w-2 h-2 rounded-full mr-2 ${
                                  job.status === 'running' ? 'bg-neon-green' : 
                                  job.status === 'paused' ? 'bg-accent-orange' : 'bg-gray-500'
                                }`}
                                animate={job.status === 'running' ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                              />
                              {job.status}
                            </motion.p>
                        </div>
                    </div>
                    <motion.div 
                      className="text-xl font-bold text-white"
                      animate={{ 
                        textShadow: job.status === 'running' ? [
                          "0 0 10px rgba(57, 255, 20, 0.5)",
                          "0 0 20px rgba(57, 255, 20, 0.8)",
                          "0 0 10px rgba(57, 255, 20, 0.5)"
                        ] : []
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {job.progress}%
                    </motion.div>
                </motion.div>
                
                <motion.div 
                  className="w-full bg-space-dark/50 rounded-full h-4 mb-3 overflow-hidden relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <motion.div 
                      className={`${color} h-4 rounded-full relative`}
                      initial={{ width: 0 }}
                      animate={{ width: `${job.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                      style={{
                        boxShadow: `0 0 10px ${glowColor}`
                      }}
                    >
                      {/* Animated shine effect */}
                      {job.status === 'running' && (
                        <div className="absolute inset-0 bg-energy-flow bg-[length:200%_100%] animate-energyFlow opacity-50" />
                      )}
                    </motion.div>
                </motion.div>
                
                <motion.div 
                  className="flex space-x-2 relative z-10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                    {job.status === 'running' && (
                        <motion.button 
                          onClick={() => updateRecycleJob(job.id, 'paused')} 
                          className="flex-1 bg-gradient-to-r from-accent-orange to-neon-orange hover:from-neon-orange hover:to-accent-orange text-space-dark font-semibold py-2 px-3 rounded-lg text-sm transition-all duration-300 shadow-neon-orange"
                          whileHover={{ scale: 1.05, boxShadow: "0 5px 20px rgba(255, 69, 0, 0.4)" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          ⏸ Pause
                        </motion.button>
                    )}
                    {job.status === 'paused' && (
                         <motion.button 
                           onClick={() => updateRecycleJob(job.id, 'running')} 
                           className="flex-1 bg-gradient-to-r from-neon-green to-accent-blue hover:from-accent-blue hover:to-neon-green text-space-dark font-semibold py-2 px-3 rounded-lg text-sm transition-all duration-300 shadow-lg"
                           whileHover={{ scale: 1.05, boxShadow: "0 5px 20px rgba(57, 255, 20, 0.4)" }}
                           whileTap={{ scale: 0.95 }}
                         >
                           ▶ Resume
                         </motion.button>
                    )}
                     {(job.status === 'running' || job.status === 'paused') && (
                        <motion.button 
                          onClick={() => updateRecycleJob(job.id, 'stopped')} 
                          className="flex-1 bg-gradient-to-r from-neon-pink to-accent-orange hover:from-accent-orange hover:to-neon-pink text-white font-semibold py-2 px-3 rounded-lg text-sm transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.05, boxShadow: "0 5px 20px rgba(255, 20, 147, 0.4)" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          ⏹ Emergency Stop
                        </motion.button>
                    )}
                </motion.div>
            </motion.div>
        )
    };
    
    const completedJobs = recycleJobs.filter(j => j.status === 'completed');
    const activeJobs = recycleJobs.filter(j => j.status !== 'completed');

    return (
        <>
            <PageHeader title="Recycling Process" subtitle="Monitor and control onboard recycling operations." />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Start New Recycling Job" delay={0.2}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.values(RecycleProcess).map((process, index) => (
                            <motion.button 
                                key={process} 
                                    onClick={() => startNewRecycleJob(process)} 
                                    disabled={isProcessDisabled(process)}
                                    className="bg-gradient-to-br from-space-light/80 to-space-mid/60 backdrop-blur-sm border border-accent-blue/30 p-4 rounded-xl text-left hover:shadow-hologram disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center relative overflow-hidden group"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                                    whileHover={!isProcessDisabled(process) ? { 
                                      scale: 1.02,
                                      boxShadow: "0 10px 30px rgba(0, 191, 255, 0.2)"
                                    } : {}}
                                    whileTap={!isProcessDisabled(process) ? { scale: 0.98 } : {}}
                            >
                                {/* Hover glow effect */}
                                {!isProcessDisabled(process) && (
                                  <div className="absolute inset-0 bg-hologram opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                )}
                                
                                <ProcessIcon process={process} />
                                <span className="ml-4 font-semibold text-white relative z-10">{process}</span>
                            </motion.button>
                        ))}
                    </div>
                </Card>

                <Card title="Active Jobs" delay={0.3}>
                    <AnimatePresence mode="wait">
                      {activeJobs.length > 0 ? (
                          <motion.div 
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                          >
                              {activeJobs.map((job, index) => (
                                <motion.div
                                  key={job.id}
                                  initial={{ opacity: 0, x: 50 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -50 }}
                                  transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                  <JobCard job={job} />
                                </motion.div>
                              ))}
                          </motion.div>
                      ) : (
                          <motion.div 
                            className="flex items-center justify-center h-full text-gray-400"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                          >
                            No active recycling jobs.
                          </motion.div>
                      )}
                    </AnimatePresence>
                </Card>
            </div>
            <div className="mt-8">
                <Card title="Completed Jobs Log" delay={0.4}>
                    {completedJobs.length > 0 ? (
                    <motion.div 
                      className="overflow-x-auto max-h-64"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-gradient-to-r from-space-mid to-space-light">
                                <tr>
                                    <th className="p-3 text-gray-300">Process</th>
                                    <th className="p-3 text-gray-300">Started</th>
                                    <th className="p-3 text-gray-300">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-accent-blue/20">
                                {completedJobs.map((job, index) => (
                                    <motion.tr 
                                      key={job.id}
                                      className="hover:bg-space-light/30 transition-colors duration-200"
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                                      whileHover={{ x: 5 }}
                                    >
                                        <td className="p-3 font-semibold">{job.process}</td>
                                        <td className="p-3 text-gray-300">{new Date(job.startTime).toLocaleString()}</td>
                                        <td className="p-3">
                                          <motion.span 
                                            className="text-neon-green font-semibold flex items-center"
                                            animate={{ 
                                              textShadow: [
                                                "0 0 5px rgba(57, 255, 20, 0.5)",
                                                "0 0 10px rgba(57, 255, 20, 0.8)",
                                                "0 0 5px rgba(57, 255, 20, 0.5)"
                                              ]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                          >
                                            <span className="w-2 h-2 bg-neon-green rounded-full mr-2 animate-pulse" />
                                            Completed
                                          </motion.span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                    ) : (
                        <motion.div 
                          className="flex items-center justify-center h-full text-gray-400"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.6, delay: 0.6 }}
                        >
                           No completed jobs yet.
                        </motion.div>
                    )}
                </Card>
            </div>
        </>
    );
};

export default Recycling;
