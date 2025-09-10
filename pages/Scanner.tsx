import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSpacecraft } from '../hooks/useSpacecraft';
import { WasteType } from '../types';
import PageHeader from '../components/PageHeader';

// Mock AI Scanner Hook
const useWasteScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<{ type: WasteType; confidence: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scan = useCallback(() => {
    setIsScanning(true);
    setResult(null);
    setError(null);
    const timeout = setTimeout(() => {
      const types = Object.values(WasteType);
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomConfidence = Math.random() * (0.99 - 0.7) + 0.7;
      
      if (Math.random() > 0.1) { // 90% success rate
        setResult({ type: randomType, confidence: randomConfidence });
      } else {
        setError("Could not identify item. Please classify manually.");
      }
      setIsScanning(false);
    }, 2000); // Simulate scanning time
    return () => clearTimeout(timeout);
  }, []);

  const reset = () => {
    setIsScanning(false);
    setResult(null);
    setError(null);
  };

  return { isScanning, result, error, scan, reset };
};


const Scanner: React.FC = () => {
  const { addWasteItem } = useSpacecraft();
  const { isScanning, result, error, scan, reset } = useWasteScanner();
  
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<WasteType | ''>('');
  const [showManual, setShowManual] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function setupWebcam() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setWebcamEnabled(true);
            setWebcamError(null);
          }
        } catch (err) {
          console.error("Webcam access error:", err);
          if (err instanceof Error) {
              if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setWebcamError("Webcam access was denied. Please allow camera permissions in your browser settings to use this feature.");
              } else {
                setWebcamError("Webcam not available or could not be started. You can upload a photo instead.");
              }
          } else {
               setWebcamError("An unknown error occurred while accessing the webcam.");
          }
          setWebcamEnabled(false);
        }
      } else {
        setWebcamError("Your browser does not support webcam access.");
        setWebcamEnabled(false);
      }
    }
    setupWebcam();
    return () => {
        if(videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, []);

  useEffect(() => {
    if (result) {
      setSelectedType(result.type);
    }
  }, [result]);

  const handleConfirm = () => {
    if (selectedType && result) {
      addWasteItem({
        type: selectedType,
        source: 'scanner',
        confidence: result.confidence,
        correctedFrom: selectedType !== result.type ? result.type : undefined
      });
      reset();
      setSelectedType('');
    }
  };

  const handleManualConfirm = () => {
    if (selectedType) {
        addWasteItem({ type: selectedType, source: 'manual' });
        reset();
        setSelectedType('');
        setShowManual(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, you would process this file. Here we just trigger the mock scan.
      scan();
    }
  };

  return (
    <>
      <PageHeader title="Trash Scanner" subtitle="Classify waste items using the onboard AI." />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Camera/Upload View */}
        <div className="bg-space-mid border border-space-light rounded-lg p-4 flex flex-col items-center justify-center min-h-[400px]">
          {webcamEnabled ? (
            <div className="w-full h-full relative">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-md" />
              {isScanning && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-t-neon-cyan border-gray-600 rounded-full animate-spin"></div>
                  <p className="mt-4 text-white">Scanning...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <p className="mb-4 text-accent-yellow">{webcamError || "Initializing Webcam..."}</p>
              <label className="cursor-pointer bg-accent-blue hover:bg-blue-400 text-white font-bold py-2 px-4 rounded transition">
                <span>Upload Waste Photo</span>
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*"/>
              </label>
               <button onClick={() => setShowManual(true)} className="mt-4 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition">
                Or Classify Manually
              </button>
            </div>
          )}
          {webcamEnabled && (
            <button
              onClick={scan}
              disabled={isScanning || !!result}
              className="mt-4 w-full bg-neon-cyan hover:bg-cyan-400 disabled:bg-gray-600 text-space-dark font-bold py-3 px-4 rounded-lg text-lg transition"
            >
              Scan Item
            </button>
          )}
        </div>

        {/* Results/Manual Entry View */}
        <div className="bg-space-mid border border-space-light rounded-lg p-6 flex flex-col justify-center">
          {error && (
             <div className="text-center">
                <p className="text-accent-red mb-4">{error}</p>
                <button onClick={() => { reset(); setShowManual(true); }} className="bg-accent-yellow text-space-dark font-bold py-2 px-4 rounded transition">
                    Classify Manually
                </button>
             </div>
          )}

          {result && !error && (
            <div className="animate-fadeIn">
              <h3 className="text-2xl font-bold mb-4 text-white">Detection Result</h3>
              <div className="mb-4">
                <p className="text-gray-400">Detected Category</p>
                <p className="text-3xl font-bold text-neon-cyan">{result.type}</p>
              </div>
              <div className="mb-6">
                <p className="text-gray-400">Confidence</p>
                <div className="w-full bg-space-light rounded-full h-4">
                  <div
                    className="bg-neon-green h-4 rounded-full"
                    style={{ width: `${result.confidence * 100}%` }}
                  ></div>
                </div>
                <p className="text-right text-lg font-semibold">{(result.confidence * 100).toFixed(1)}%</p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="override" className="block text-gray-400 mb-2">Manual Override (if incorrect)</label>
                <select 
                  id="override" 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as WasteType)}
                  className="w-full bg-space-light border border-gray-600 rounded-lg p-3 text-white focus:ring-accent-blue focus:border-accent-blue"
                >
                  {Object.values(WasteType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4">
                <button onClick={handleConfirm} className="flex-1 bg-neon-green hover:bg-green-400 text-space-dark font-bold py-3 px-4 rounded-lg text-lg transition">✅ Confirm</button>
                <button onClick={reset} className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg text-lg transition">🔄 Retake</button>
              </div>
            </div>
          )}

          {(!result && !error) || showManual ? (
            <div className={showManual ? 'animate-fadeIn' : 'text-center text-gray-500'}>
              {showManual ? (
                  <div>
                      <h3 className="text-2xl font-bold mb-4 text-white">Manual Classification</h3>
                       <select 
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value as WasteType)}
                          className="w-full bg-space-light border border-gray-600 rounded-lg p-3 text-white focus:ring-accent-blue focus:border-accent-blue mb-4"
                        >
                          <option value="" disabled>Select waste type...</option>
                          {Object.values(WasteType).map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        <button 
                            onClick={handleManualConfirm}
                            disabled={!selectedType}
                            className="w-full bg-neon-green hover:bg-green-400 disabled:bg-gray-600 text-space-dark font-bold py-3 px-4 rounded-lg text-lg transition">
                            Log Item
                        </button>
                        <button onClick={() => setShowManual(false)} className="w-full mt-2 text-gray-400 hover:text-white">Cancel</button>
                  </div>
              ) : (
                <p>Scan an item or upload a photo to begin classification.</p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Scanner;