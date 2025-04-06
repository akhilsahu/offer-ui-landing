import React from 'react';
import { Button } from '@/components/ui/button';
import Coin from '@/components/ui/Coin';

import { Plus } from 'lucide-react';

type HeaderSectionProps = {
  title: string;
  tagline: string;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  points?: number;
};

export default function HeaderSection({
  title,
  tagline,
  showButton = false,
  buttonText = 'Hey !!',
  onButtonClick,
  points = 0,
}: HeaderSectionProps) {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500">
            {title}
          </h1>
          <p className="text-gray-400">{tagline}</p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Right Button */}
          {showButton && (
            <Button
              onClick={onButtonClick}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              {buttonText}
            </Button>
          )}
        </div>
        <Coin points={points} />
      </div>
    </div>
  );
}
