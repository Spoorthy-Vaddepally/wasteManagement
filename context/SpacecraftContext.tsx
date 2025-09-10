
import React, { createContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { WasteItem, WasteType, RecycleJob, RecycleProcess, EnergyLog, LogEntry } from '../types';
import { MOCK_MISSION_START_DATE } from '../constants';

interface SpacecraftState {
  missionDay: number;
  wasteInventory: WasteItem[];
  recycleJobs: RecycleJob[];
  energyLogs: EnergyLog[];
  systemLogs: LogEntry[];
  storageCapacity: number; // in kg
  storageUsed: number;
  addWasteItem: (item: Omit<WasteItem, 'id' | 'timestamp'>) => void;
  updateRecycleJob: (id: string, status: 'running' | 'paused' | 'stopped') => void;
  startNewRecycleJob: (process: RecycleProcess) => void;
}

export const SpacecraftContext = createContext<SpacecraftState | undefined>(undefined);

const initialWaste: WasteItem[] = [
    { id: 'w1', timestamp: new Date(MOCK_MISSION_START_DATE.getTime() + 2 * 86400000).toISOString(), type: WasteType.Plastic, source: 'scanner', confidence: 0.95 },
    { id: 'w2', timestamp: new Date(MOCK_MISSION_START_DATE.getTime() + 3 * 86400000).toISOString(), type: WasteType.Organic, source: 'manual' },
    { id: 'w3', timestamp: new Date(MOCK_MISSION_START_DATE.getTime() + 4 * 86400000).toISOString(), type: WasteType.Metal, source: 'scanner', confidence: 0.88 },
    { id: 'w4', timestamp: new Date(MOCK_MISSION_START_DATE.getTime() + 5 * 86400000).toISOString(), type: WasteType.Textile, source: 'upload' },
    { id: 'w5', timestamp: new Date(MOCK_MISSION_START_DATE.getTime() + 6 * 86400000).toISOString(), type: WasteType.Plastic, source: 'scanner', confidence: 0.99 },
];

const initialJobs: RecycleJob[] = [
    { id: 'j1', process: RecycleProcess.OrganicToGreywater, status: 'completed', progress: 100, startTime: new Date(MOCK_MISSION_START_DATE.getTime() + 3 * 86400000).toISOString()},
    { id: 'j2', process: RecycleProcess.PlasticToFilament, status: 'running', progress: 65, startTime: new Date(MOCK_MISSION_START_DATE.getTime() + 6 * 86400000).toISOString()},
];

// Generate more realistic energy data
const generateInitialEnergyLogs = () => {
    const logs: EnergyLog[] = [];
    const baseAvailable = 500; // kWh
    const baseConsumption = 20; // kWh
    for (let i = 0; i < 7; i++) {
        const timestamp = new Date(MOCK_MISSION_START_DATE.getTime() + i * 86400000).toISOString();
        const available = baseAvailable + (Math.random() - 0.5) * 50;
        const consumed = baseConsumption + Math.random() * 15 + (i % 3 === 0 ? 10 : 0); // spike consumption
        logs.push({ timestamp, available: parseFloat(available.toFixed(2)), consumed: parseFloat(consumed.toFixed(2)) });
    }
    return logs;
}

export const SpacecraftProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [missionDay, setMissionDay] = useState(0);
  const [wasteInventory, setWasteInventory] = useState<WasteItem[]>(initialWaste);
  const [recycleJobs, setRecycleJobs] = useState<RecycleJob[]>(initialJobs);
  const [energyLogs, setEnergyLogs] = useState<EnergyLog[]>(generateInitialEnergyLogs);
  const [systemLogs, setSystemLogs] = useState<LogEntry[]>([]);
  
  const storageCapacity = 500; // kg

  useEffect(() => {
    const calculateMissionDay = () => {
        const now = new Date();
        const diff = now.getTime() - MOCK_MISSION_START_DATE.getTime();
        setMissionDay(Math.floor(diff / (1000 * 60 * 60 * 24)) + 1);
    };
    calculateMissionDay();
    const timer = setInterval(calculateMissionDay, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const addLog = useCallback((message: string, type: LogEntry['type']) => {
    setSystemLogs(prev => [{ id: `log-${Date.now()}`, timestamp: new Date().toISOString(), message, type }, ...prev]);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
        setRecycleJobs(prevJobs => 
            prevJobs.map(job => {
                if (job.status === 'running' && job.progress < 100) {
                    const newProgress = Math.min(100, job.progress + 1);
                    if (newProgress === 100) {
                        addLog(`Recycling job "${job.process}" completed.`, 'success');
                        return { ...job, progress: newProgress, status: 'completed' };
                    }
                    return { ...job, progress: newProgress };
                }
                return job;
            })
        );

        // Simulate energy consumption
        setEnergyLogs(prev => {
            const lastLog = prev[prev.length - 1];
            if (!lastLog) return prev;
            
            const runningJobs = recycleJobs.filter(j => j.status === 'running').length;
            const newConsumed = lastLog.consumed + (runningJobs * 0.1) + Math.random() * 0.05;
            
            if (new Date().getDate() !== new Date(lastLog.timestamp).getDate()) {
                 // New day, new log entry
                 return [...prev, {
                     timestamp: new Date().toISOString(),
                     available: 500 + (Math.random() - 0.5) * 50,
                     consumed: newConsumed
                 }];
            } else {
                 // Update today's log
                 const updatedLogs = [...prev];
                 updatedLogs[updatedLogs.length - 1] = { ...lastLog, consumed: parseFloat(newConsumed.toFixed(2)) };
                 return updatedLogs;
            }
        });

    }, 2000); // Update progress and energy every 2 seconds
    return () => clearInterval(interval);
  }, [recycleJobs, addLog]);
  
  const addWasteItem = (item: Omit<WasteItem, 'id' | 'timestamp'>) => {
    const newItem: WasteItem = {
      ...item,
      id: `w-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setWasteInventory(prev => [newItem, ...prev]);
    addLog(`Logged ${item.type} from ${item.source}.`, 'info');
  };

  const updateRecycleJob = (id: string, status: 'running' | 'paused' | 'stopped') => {
    setRecycleJobs(prev => prev.map(job => {
        if (job.id === id) {
            addLog(`Recycling job "${job.process}" status changed to ${status}.`, status === 'stopped' ? 'warning' : 'info');
            return { ...job, status };
        }
        return job;
    }));
  };

  const startNewRecycleJob = (process: RecycleProcess) => {
    const newJob: RecycleJob = {
      id: `j-${Date.now()}`,
      process,
      status: 'running',
      progress: 0,
      startTime: new Date().toISOString(),
    };
    setRecycleJobs(prev => [newJob, ...prev]);
    addLog(`New recycling job "${process}" started.`, 'success');
  };

  const storageUsed = useMemo(() => {
    // Assuming each item is 1kg for simplicity
    return wasteInventory.length;
  }, [wasteInventory]);

  const value = {
    missionDay,
    wasteInventory,
    recycleJobs,
    energyLogs,
    systemLogs,
    storageCapacity,
    storageUsed,
    addWasteItem,
    updateRecycleJob,
    startNewRecycleJob,
  };

  return (
    <SpacecraftContext.Provider value={value}>
      {children}
    </SpacecraftContext.Provider>
  );
};
