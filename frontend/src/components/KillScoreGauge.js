import React from 'react';
import { motion } from 'framer-motion';

const KillScoreGauge = ({ score }) => {
  const getScoreColor = () => {
    if (score >= 70) return '#00FF94';
    if (score >= 40) return '#FFD600';
    return '#FF0055';
  };

  const getScoreLabel = () => {
    if (score >= 70) return 'Excellent Opportunity';
    if (score >= 40) return 'Good Potential';
    return 'Challenging';
  };

  const getScoreClass = () => {
    if (score >= 70) return 'kill-score-high';
    if (score >= 40) return 'kill-score-medium';
    return 'kill-score-low';
  };

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-48 h-48 mx-auto" data-testid="kill-score-gauge">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          className="text-muted/30"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke={getScoreColor()}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 8px ${getScoreColor()})`
          }}
        />
      </svg>
      
      {/* Score display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className={`text-5xl font-bold font-mono ${getScoreClass()}`}
        >
          {score}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xs text-muted-foreground mt-1"
        >
          out of 100
        </motion.div>
      </div>
      
      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-4"
      >
        <span 
          className="text-sm font-medium px-3 py-1 rounded-full"
          style={{ 
            backgroundColor: `${getScoreColor()}20`,
            color: getScoreColor()
          }}
        >
          {getScoreLabel()}
        </span>
      </motion.div>
    </div>
  );
};

export default KillScoreGauge;
