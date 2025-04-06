import React, { useEffect, useState } from 'react';
import { Coins } from 'lucide-react';
import { Badge } from './badgeCoin';
import { cn } from '../../lib/utils';
import '@/styles/Coin.css';

interface CoinProps {
  points: number;
  className?: string;
}

const Coin: React.FC<CoinProps> = ({ points, className = '' }) => {
  const [sparks, setSparks] = useState<
    Array<{ id: number; style: React.CSSProperties }>
  >([]);
  const isLowBalance = points < 100;

  // Generate new sparks periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newSpark = {
        id: Date.now(),
        style: {
          '--tx': `${Math.random() * 20 - 10}px`,
          '--ty': `${Math.random() * 20 - 10}px`,
          '--r': `${Math.random() * 180}deg`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        } as React.CSSProperties,
      };

      setSparks((prev) => [...prev, newSpark]);

      // Remove spark after animation completes
      setTimeout(() => {
        setSparks((prev) => prev.filter((spark) => spark.id !== newSpark.id));
      }, 700);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="coin-wrapper">
      <Badge
        variant="gold"
        className={cn(
          'coin-badge',
          isLowBalance ? 'coin-badge-low' : 'coin-badge-normal',
          className
        )}
      >
        <span className="points-value">{points}</span>
        <div className="coin-icon">
          <Coins />
          <div
            className={cn(
              'shimmer-overlay animate-shimmer',
              isLowBalance ? 'shimmer-low' : ''
            )}
          ></div>
        </div>

        {/* Spark elements */}
        <div className="sparks-container">
          {sparks.map((spark) => (
            <div
              key={spark.id}
              className={cn(
                'spark animate-spark',
                isLowBalance ? 'spark-low' : ''
              )}
              style={spark.style}
            />
          ))}
        </div>
      </Badge>

      {isLowBalance && <div className="low-balance-text">Low Balance</div>}
    </div>
  );
};

export default Coin;
