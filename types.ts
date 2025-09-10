
export enum WasteType {
  Plastic = 'Plastic',
  Metal = 'Metal',
  Textile = 'Textile',
  Organic = 'Organic',
}

export interface WasteItem {
  id: string;
  timestamp: string;
  type: WasteType;
  source: 'scanner' | 'manual' | 'upload';
  confidence?: number;
  correctedFrom?: WasteType;
}

export enum RecycleProcess {
  PlasticToFilament = 'Plastic → 3D Filament',
  TextileToInsulation = 'Textile → Insulation Panel',
  MetalToComponent = 'Metal → Spare Component',
  OrganicToGreywater = 'Organic → Greywater',
}

export interface RecycleJob {
  id: string;
  process: RecycleProcess;
  status: 'running' | 'paused' | 'stopped' | 'completed';
  progress: number; // 0 to 100
  startTime: string;
}

export interface EnergyLog {
  timestamp: string;
  consumed: number; // in kWh
  available: number; // in kWh
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}
