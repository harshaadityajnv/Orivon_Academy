import React, { useState, useEffect } from 'react';

interface EnterNameModalProps {
  open: boolean;
  defaultName?: string;
  courseTitle?: string;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

const EnterNameModal: React.FC<EnterNameModalProps> = ({ open, defaultName = '', courseTitle, onClose, onConfirm }) => {
  const [name, setName] = useState(defaultName);

  useEffect(() => {
    if (open) setName(defaultName || '');
  }, [open, defaultName]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Enter name for certificate</h3>
        </div>
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Full name to display on certificate</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            placeholder="Enter full name"
          />
          {/* place course title a bit down to avoid crowding the input */}
          {courseTitle && (
            <div className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-600">
              <div className="text-xs text-gray-500">Course</div>
              <div className="font-medium text-gray-800">{courseTitle}</div>
            </div>
          )}
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={onClose} className="bg-secondary hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Cancel</button>
            <button
              onClick={() => onConfirm(name.trim() || defaultName)}
              className="bg-primary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterNameModal;
