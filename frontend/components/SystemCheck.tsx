
import React, { useState, useEffect } from 'react';

interface SystemCheckProps {
  onReady: () => void;
}

const SystemCheck: React.FC<SystemCheckProps> = ({ onReady }) => {
  const [checks, setChecks] = useState({
    camera: 'pending', // pending, success, error
    microphone: 'pending',
    network: 'pending',
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const runChecks = async () => {
      // 1. Network Check
      setChecks(prev => ({ ...prev, network: navigator.onLine ? 'success' : 'error' }));

      // 2. Media Check
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        // Stop tracks immediately after check
        stream.getTracks().forEach(track => track.stop());
        setChecks(prev => ({ ...prev, camera: 'success', microphone: 'success' }));
      } catch (err) {
        console.error(err);
        setChecks(prev => ({ ...prev, camera: 'error', microphone: 'error' }));
        setErrorMsg("Could not access camera or microphone. Please allow permissions.");
      }
    };

    runChecks();
  }, []);

  const allPassed = checks.camera === 'success' && checks.microphone === 'success' && checks.network === 'success';

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-bold text-dark mb-6">System Compatibility Check</h2>
      
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="font-medium">Camera Access</span>
          {checks.camera === 'pending' && <span className="text-gray-500">Checking...</span>}
          {checks.camera === 'success' && <span className="text-green-600 font-bold flex items-center">✓ OK</span>}
          {checks.camera === 'error' && <span className="text-red-600 font-bold">✗ Failed</span>}
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="font-medium">Microphone Access</span>
          {checks.microphone === 'pending' && <span className="text-gray-500">Checking...</span>}
          {checks.microphone === 'success' && <span className="text-green-600 font-bold flex items-center">✓ OK</span>}
          {checks.microphone === 'error' && <span className="text-red-600 font-bold">✗ Failed</span>}
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="font-medium">Network Connection</span>
          {checks.network === 'pending' && <span className="text-gray-500">Checking...</span>}
          {checks.network === 'success' && <span className="text-green-600 font-bold flex items-center">✓ OK</span>}
          {checks.network === 'error' && <span className="text-red-600 font-bold">✗ Failed</span>}
        </div>
      </div>

      {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}

      <button
        onClick={onReady}
        disabled={!allPassed}
        className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
      >
        {allPassed ? 'Proceed to Exam' : 'Fix Issues to Continue'}
      </button>
      
    </div>
  );
};

export default SystemCheck;
