import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface RegretMeterProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export function RegretMeter({ 
  score, 
  size = 'lg', 
  showLabel = true,
  animated = true 
}: RegretMeterProps) {
  const [displayScore, setDisplayScore] = useState(0);
  
  useEffect(() => {
    if (animated) {
      const timeout = setTimeout(() => setDisplayScore(score), 100);
      return () => clearTimeout(timeout);
    } else {
      setDisplayScore(score);
    }
  }, [score, animated]);

  const dimensions = {
    sm: { width: 160, height: 100, strokeWidth: 8 },
    md: { width: 240, height: 140, strokeWidth: 10 },
    lg: { width: 320, height: 180, strokeWidth: 12 },
  };

  const { width, height, strokeWidth } = dimensions[size];
  const radius = (width - strokeWidth * 2) / 2;
  const centerX = width / 2;
  const centerY = height - 20;
  
  // Arc from -180deg to 0deg (half circle)
  const circumference = Math.PI * radius;
  const progress = (displayScore / 100) * circumference;
  const offset = circumference - progress;

  const getLevel = () => {
    if (score < 35) return 'low';
    if (score < 65) return 'medium';
    return 'high';
  };

  const level = getLevel();
  
  const levelConfig = {
    low: { 
      label: 'Low Regret', 
      emoji: '😌',
      message: "You're doing great!",
      colorClass: 'dial-fill-low'
    },
    medium: { 
      label: 'Medium Regret', 
      emoji: '😬',
      message: 'Think twice about this one',
      colorClass: 'dial-fill-medium'
    },
    high: { 
      label: 'High Regret', 
      emoji: '😱',
      message: 'Future you will remember this',
      colorClass: 'dial-fill-high'
    },
  };

  const config = levelConfig[level];

  return (
    <div className={cn(
      "flex flex-col items-center",
      animated && "animate-dial-pulse"
    )}>
      <svg 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        {/* Background track */}
        <path
          d={`M ${strokeWidth} ${centerY} A ${radius} ${radius} 0 0 1 ${width - strokeWidth} ${centerY}`}
          className="dial-track"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress arc */}
        <path
          d={`M ${strokeWidth} ${centerY} A ${radius} ${radius} 0 0 1 ${width - strokeWidth} ${centerY}`}
          className={cn("dial-fill", config.colorClass)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ 
            transition: animated ? 'stroke-dashoffset 1s ease-out' : 'none'
          }}
        />
        
        {/* Center emoji */}
        <text
          x={centerX}
          y={centerY - radius / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-4xl"
          style={{ fontSize: size === 'lg' ? '3rem' : size === 'md' ? '2.5rem' : '2rem' }}
        >
          {config.emoji}
        </text>
        
        {/* Score */}
        <text
          x={centerX}
          y={centerY - 10}
          textAnchor="middle"
          className="fill-foreground font-bold"
          style={{ fontSize: size === 'lg' ? '2rem' : size === 'md' ? '1.5rem' : '1.25rem' }}
        >
          {Math.round(displayScore)}
        </text>
        
        {/* Min/Max labels */}
        <text x={strokeWidth + 5} y={centerY + 20} className="fill-muted-foreground text-xs">
          0
        </text>
        <text x={width - strokeWidth - 15} y={centerY + 20} className="fill-muted-foreground text-xs">
          100
        </text>
      </svg>
      
      {showLabel && (
        <div className="text-center mt-2 space-y-1">
          <p className={cn(
            "font-semibold text-lg",
            level === 'low' && "text-regret-low",
            level === 'medium' && "text-regret-medium",
            level === 'high' && "text-regret-high"
          )}>
            {config.label}
          </p>
          <p className="text-sm text-muted-foreground">{config.message}</p>
        </div>
      )}
    </div>
  );
}
