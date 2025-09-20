import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
        <motion.div 
          className="bg-gradient-to-br from-space-mid/80 to-space-light/60 backdrop-blur-sm border border-accent-blue/30 rounded-xl p-4 flex flex-col items-center justify-center min-h-[400px] shadow-hologram relative overflow-hidden"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ boxShadow: "0 20px 40px rgba(0, 191, 255, 0.2)" }}
        >
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-blue/20 via-accent-purple/20 to-accent-blue/20 opacity-50 blur-sm" />
          
          {webcamEnabled ? (
            <motion.div 
              className="w-full h-full relative z-10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-lg border border-accent-blue/50 shadow-lg" />
              <AnimatePresence>
                {isScanning && (
                  <motion.div 
                    className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="w-16 h-16 border-4 border-t-neon-cyan border-gray-600 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{
                        boxShadow: "0 0 20px rgba(0, 245, 255, 0.5)"
                      }}
                    />
                    <motion.p 
                      className="mt-4 text-white font-semibold"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      Scanning...
                    </motion.p>
                    
                    {/* Scanning line effect */}
                    <motion.div
                      className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent"
                      animate={{ y: [0, 300, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              className="text-center text-gray-300 z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.p 
                className="mb-4 text-accent-orange"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {webcamError || "Initializing Webcam..."}
              </motion.p>
              <motion.label 
                className="cursor-pointer bg-gradient-to-r from-accent-blue to-neon-purple hover:from-neon-purple hover:to-accent-blue text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-neon-blue inline-block mb-4"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0, 191, 255, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Upload Waste Photo</span>
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*"/>
              </motion.label>
              <br />
              <motion.button 
                onClick={() => setShowManual(true)} 
                className="bg-gradient-to-r from-space-light to-space-mid hover:from-space-mid hover:to-space-light text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 border border-accent-blue/30"
                whileHover={{ scale: 1.05, boxShadow: "0 5px 20px rgba(0, 191, 255, 0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                Or Classify Manually
              </motion.button>
            </motion.div>
          )}
          {webcamEnabled && (
            <motion.button
              onClick={scan}
              disabled={isScanning || !!result}
              className="mt-4 w-full bg-gradient-to-r from-neon-cyan to-accent-blue hover:from-accent-blue hover:to-neon-purple disabled:from-gray-600 disabled:to-gray-700 text-space-dark disabled:text-gray-400 font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 shadow-neon-blue relative z-10 overflow-hidden"
              whileHover={{ scale: isScanning || result ? 1 : 1.02 }}
              whileTap={{ scale: isScanning || result ? 1 : 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-energy-flow bg-[length:200%_100%] animate-energyFlow opacity-30" />
              <span className="relative z-10">
              Scan Item
              </span>
            </motion.button>
          )}
        </motion.div>

        {/* Results/Manual Entry View */}
        <motion.div 
          className="bg-gradient-to-br from-space-mid/80 to-space-light/60 backdrop-blur-sm border border-accent-blue/30 rounded-xl p-6 flex flex-col justify-center shadow-hologram relative overflow-hidden"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          whileHover={{ boxShadow: "0 20px 40px rgba(0, 191, 255, 0.2)" }}
        >
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-purple/20 via-accent-blue/20 to-accent-purple/20 opacity-50 blur-sm" />
          
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                className="text-center z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
              >
                <motion.p 
                  className="text-accent-orange mb-4 font-semibold"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {error}
                </motion.p>
                <motion.button 
                  onClick={() => { reset(); setShowManual(true); }} 
                  className="bg-gradient-to-r from-accent-orange to-neon-orange hover:from-neon-orange hover:to-accent-orange text-space-dark font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-neon-orange"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(255, 69, 0, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                    Classify Manually
                </motion.button>
              </motion.div>
            )}

            {result && !error && (
              <motion.div 
                className="z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <motion.h3 
                  className="text-2xl font-bold mb-4 text-white flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <motion.span 
                    className="w-3 h-3 bg-neon-green rounded-full mr-3"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  Detection Result
                </motion.h3>
                <motion.div 
                  className="mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                <p className="text-gray-400">Detected Category</p>
                <motion.p 
                  className="text-3xl font-bold text-neon-cyan"
                  animate={{ 
                    textShadow: [
                      "0 0 10px rgba(0, 245, 255, 0.5)",
                      "0 0 20px rgba(0, 245, 255, 0.8)",
                      "0 0 10px rgba(0, 245, 255, 0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {result.type}
                </motion.p>
              </motion.div>
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <p className="text-gray-400">Confidence</p>
                <div className="w-full bg-space-light/50 rounded-full h-4 overflow-hidden relative">
                  <motion.div
                    className="bg-gradient-to-r from-neon-green to-accent-blue h-4 rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence * 100}%` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    style={{
                      boxShadow: "0 0 10px rgba(57, 255, 20, 0.5)"
                    }}
                  >
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-energy-flow bg-[length:200%_100%] animate-energyFlow opacity-50" />
                  </motion.div>
                </div>
                <motion.p 
                  className="text-right text-lg font-semibold text-white mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1.0 }}
                >
                  {(result.confidence * 100).toFixed(1)}%
                </motion.p>
              </motion.div>
              
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <label htmlFor="override" className="block text-gray-400 mb-2">Manual Override (if incorrect)</label>
                <select 
                  id="override" 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as WasteType)}
                  className="w-full bg-gradient-to-r from-space-light/80 to-space-mid/60 border border-accent-blue/30 rounded-lg p-3 text-white focus:ring-2 focus:ring-accent-blue focus:border-accent-blue transition-all duration-300 backdrop-blur-sm"
                >
                  {Object.values(WasteType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </motion.div>

              <motion.div 
                className="flex space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <motion.button 
                  onClick={handleConfirm} 
                  className="flex-1 bg-gradient-to-r from-neon-green to-accent-blue hover:from-accent-blue hover:to-neon-green text-space-dark font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 shadow-lg relative overflow-hidden"
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(57, 255, 20, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-energy-flow bg-[length:200%_100%] animate-energyFlow opacity-30" />
                  <span className="relative z-10">✅ Confirm</span>
                </motion.button>
                <motion.button 
                  onClick={reset} 
                  className="flex-1 bg-gradient-to-r from-space-light to-space-mid hover:from-space-mid hover:to-space-light text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 border border-accent-blue/30"
                  whileHover={{ scale: 1.02, boxShadow: "0 5px 20px rgba(0, 191, 255, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  🔄 Retake
                </motion.button>
              </motion.div>
              </motion.div>
            )}

            {((!result && !error) || showManual) && (
              <motion.div 
                className={showManual ? 'z-10' : 'text-center text-gray-400 z-10'}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
              {showManual ? (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                      <motion.h3 
                        className="text-2xl font-bold mb-4 text-white flex items-center"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        <motion.span 
                          className="w-3 h-3 bg-accent-orange rounded-full mr-3"
                          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        Manual Classification
                      </motion.h3>
                      <motion.select 
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value as WasteType)}
                          className="w-full bg-gradient-to-r from-space-light/80 to-space-mid/60 border border-accent-blue/30 rounded-lg p-3 text-white focus:ring-2 focus:ring-accent-blue focus:border-accent-blue mb-4 transition-all duration-300 backdrop-blur-sm"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 }}
                        >
                          <option value="" disabled>Select waste type...</option>
                          {Object.values(WasteType).map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </motion.select>
                        <motion.button 
                            onClick={handleManualConfirm}
                            disabled={!selectedType}
                            className="w-full bg-gradient-to-r from-neon-green to-accent-blue hover:from-accent-blue hover:to-neon-green disabled:from-gray-600 disabled:to-gray-700 text-space-dark disabled:text-gray-400 font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 shadow-lg mb-2 relative overflow-hidden"
                            whileHover={{ scale: selectedType ? 1.02 : 1, boxShadow: selectedType ? "0 10px 30px rgba(57, 255, 20, 0.4)" : "none" }}
                            whileTap={{ scale: selectedType ? 0.98 : 1 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                        >
                            {selectedType && <div className="absolute inset-0 bg-energy-flow bg-[length:200%_100%] animate-energyFlow opacity-30" />}
                            <span className="relative z-10">
                            Log Item
                            </span>
                        </motion.button>
                        <motion.button 
                          onClick={() => setShowManual(false)} 
                          className="w-full text-gray-400 hover:text-white transition-colors duration-200"
                          whileHover={{ scale: 1.02 }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.5 }}
                        >
                          Cancel
                        </motion.button>
                  </motion.div>
              ) : (
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  Scan an item or upload a photo to begin classification.
                </motion.p>
              )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};

export default Scanner;