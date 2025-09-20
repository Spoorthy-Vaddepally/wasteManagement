import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  const StatCard = ({ label, value, unit, icon, delay = 0 }: { label: string; value: string | number; unit: string; icon: string; delay?: number }) => (
    <motion.div 
      className="bg-gradient-to-br from-space-light/80 to-space-mid/60 backdrop-blur-sm border border-accent-blue/30 p-4 rounded-xl flex items-center shadow-hologram relative overflow-hidden group"
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
      whileHover={{ 
        scale: 1.05, 
        boxShadow: "0 20px 40px rgba(0, 191, 255, 0.3)",
        transition: { duration: 0.3 }
      }}
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/10 via-accent-purple/10 to-accent-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <motion.div 
        className="text-3xl mr-4 relative z-10"
        animate={{ 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        {icon}
      </motion.div>
      <div className="relative z-10">
        <motion.div 
          className="text-gray-300 text-sm"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: delay + 0.2 }}
        >
          {label}
        </motion.div>
        <motion.div 
          className="text-2xl font-bold text-white"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: delay + 0.3 }}
        >
          {value} <span className="text-base font-normal text-accent-blue">{unit}</span>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <>
      <PageHeader title={`Mission Day ${missionDay}`} subtitle="Welcome to the MIRIS Command Center" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Waste Collected" value={totalWaste} unit="kg" icon="🗑️" delay={0} />
        <StatCard label="Energy Available" value={todayEnergy.available.toFixed(1)} unit="kWh" icon="🔋" delay={0.1} />
        <StatCard label="Energy Consumed Today" value={todayEnergy.consumed.toFixed(1)} unit="kWh" icon="⚡" delay={0.2} />
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            to="/crew/scanner" 
            className="bg-gradient-to-r from-neon-cyan to-accent-blue hover:from-accent-blue hover:to-neon-purple text-space-dark font-bold p-4 rounded-xl flex items-center justify-center text-xl transition-all duration-300 shadow-neon-blue relative overflow-hidden group h-full"
          >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-energy-flow bg-[length:200%_100%] animate-energyFlow opacity-30" />
            
            <motion.span 
              className="mr-3 relative z-10"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              🛰️
            </motion.span>
            <span className="relative z-10">Start Waste Scan</span>
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Waste Breakdown by Category" className="lg:col-span-1" delay={0.4}>
            <ul className="space-y-3 text-lg">
                {Object.values(WasteType).map((type, index) => (
                    <motion.li 
                      key={type} 
                      className="flex justify-between items-center p-2 rounded-lg hover:bg-space-light/30 transition-colors duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                        <span className="text-gray-300">{type}</span>
                        <motion.span 
                          className="font-semibold text-white bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 border border-accent-blue/30 px-3 py-1 rounded-lg shadow-sm"
                          whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(0, 191, 255, 0.3)" }}
                        >
                          {categoryBreakdown[type] || 0} kg
                        </motion.span>
                    </motion.li>
                ))}
            </ul>
        </Card>

        <Card title="Cumulative Recycling Outputs" className="lg:col-span-2" delay={0.5}>
            {Object.keys(recyclingOutputs).length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Object.entries(recyclingOutputs).map(([name, value], index) => (
                        <motion.div 
                          key={name} 
                          className="bg-gradient-to-br from-space-dark/80 to-space-light/40 border border-accent-purple/30 p-4 rounded-xl text-center relative overflow-hidden group"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 10px 30px rgba(153, 50, 204, 0.3)"
                          }}
                        >
                          {/* Animated background glow */}
                          <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 to-accent-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <motion.div 
                            className="text-3xl font-bold text-neon-cyan relative z-10"
                            animate={{ 
                              textShadow: [
                                "0 0 10px rgba(0, 245, 255, 0.5)",
                                "0 0 20px rgba(0, 245, 255, 0.8)",
                                "0 0 10px rgba(0, 245, 255, 0.5)"
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            {value}
                          </motion.div>
                          <div className="text-sm text-gray-300 relative z-10">{name}</div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div 
                  className="flex items-center justify-center h-full text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                    No recycling outputs yet.
                </motion.div>
            )}
        </Card>
      </div>
    </>
  );
};

export default Overview;