
import React from 'react';

interface WebcamFeedProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isCameraReady: boolean;
}

const WebcamFeed: React.FC<WebcamFeedProps> = ({ videoRef, isCameraReady }) => {
  return (
    <div className="bg-dark rounded-lg shadow-lg p-4 relative">
      <h4 className="text-lg font-semibold text-white mb-3">Live Feed</h4>
      <div className="aspect-w-4 aspect-h-3 bg-black rounded-md overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transform scale-x-[-1] ${isCameraReady ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
        />
        {!isCameraReady && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
             <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>
       <div className="absolute top-6 right-6 flex items-center bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            REC
        </div>
    </div>
  );
};

export default WebcamFeed;
