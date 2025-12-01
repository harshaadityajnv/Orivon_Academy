
import React from 'react';
import { Alert, AlertType } from '../types';

interface AlertsPanelProps {
  alerts: Alert[];
}

const AlertIcon: React.FC<{ type: AlertType }> = ({ type }) => {
  const iconClasses = "h-5 w-5 mr-3";
  switch (type) {
    case 'tab-switch':
      return <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
    case 'looking-away':
      return <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59" /></svg>;
    case 'phone-detected':
      return <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
    case 'multiple-faces':
      return <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
    case 'face-unclear':
    case 'no-face':
        return <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>;
    default:
      return <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  }
};


const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  const getAlertColor = (type: AlertType) => {
    switch(type) {
        case 'system': return 'border-blue-500';
        case 'tab-switch': return 'border-yellow-500';
        default: return 'border-red-500';
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-96 flex flex-col">
      <h4 className="text-lg font-semibold text-dark mb-3">Proctoring Alerts</h4>
      <div className="flex-grow overflow-y-auto pr-2">
        {alerts.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            No alerts yet.
          </div>
        ) : (
          <ul className="space-y-3">
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className={`flex items-center p-3 rounded-lg border-l-4 ${getAlertColor(alert.type)} bg-gray-50`}
              >
                <AlertIcon type={alert.type} />
                <div>
                  <p className="font-medium text-sm text-dark">{alert.message}</p>
                  <p className="text-xs text-secondary">{alert.timestamp}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;
