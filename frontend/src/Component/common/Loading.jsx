import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ size = 'md', fullScreen = false, text = 'Loading...' }) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="flex flex-col items-center">
          <Loader2 className={`${sizeMap[size]} text-blue-600 animate-spin`} />
          {text && <p className="mt-2 text-gray-700">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Loader2 className={`${sizeMap[size]} text-blue-600 animate-spin`} />
      {text && <p className="mt-2 text-gray-700">{text}</p>}
    </div>
  );
};

export default Loading;
