import { motion } from 'framer-motion';

export interface ProgressItem {
  id: string;
  label: string;
  isCompleted: boolean;
  isActive?: boolean;
}

interface ProgressLineProps {
  items: ProgressItem[];
  title?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressLine({ 
  items, 
  title, 
  showPercentage = true, 
  className = '' 
}: ProgressLineProps) {
  const completedCount = items.filter(item => item.isCompleted).length;
  const totalCount = items.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      {(title || showPercentage) && (
        <div className="flex justify-between items-center mb-4">
          {title && (
            <h3 className="text-sm font-pixel text-purple-400 leading-relaxed">
              {title}
            </h3>
          )}
          {showPercentage && (
            <div className="text-xs font-pixel text-purple-300">
              {completedCount}/{totalCount} ({Math.round(completionPercentage)}%)
            </div>
          )}
        </div>
      )}

      {/* Progress Line Container */}
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-600 rounded-full transform -translate-y-1/2" />
        
        {/* Progress Line */}
        <motion.div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transform -translate-y-1/2"
          initial={{ width: 0 }}
          animate={{ width: `${completionPercentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Progress Nodes */}
        <div className="relative flex justify-between items-center">
          {items.map((item, index) => {
            const nodePosition = totalCount > 1 ? (index / (totalCount - 1)) * 100 : 50;
            
            return (
              <motion.div
                key={item.id}
                className="relative flex flex-col items-center"
                style={{ 
                  position: totalCount === 1 ? 'relative' : 'absolute',
                  left: totalCount === 1 ? 'auto' : `${nodePosition}%`,
                  transform: totalCount === 1 ? 'none' : 'translateX(-50%)'
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                {/* Node Circle */}
                <motion.div
                  className={`
                    w-4 h-4 rounded-full border-2 flex items-center justify-center relative z-10
                    ${item.isCompleted 
                      ? 'bg-purple-500 border-purple-400' 
                      : item.isActive 
                        ? 'bg-purple-400/50 border-purple-400' 
                        : 'bg-gray-700 border-gray-500'
                    }
                  `}
                  whileHover={{ scale: 1.2 }}
                  animate={item.isActive ? {
                    boxShadow: [
                      "0 0 0px rgba(168, 85, 247, 0)",
                      "0 0 8px rgba(168, 85, 247, 0.6)",
                      "0 0 0px rgba(168, 85, 247, 0)"
                    ]
                  } : {}}
                  transition={item.isActive ? {
                    boxShadow: { duration: 2, repeat: Infinity }
                  } : {}}
                >
                  {item.isCompleted && (
                    <motion.div
                      className="text-white text-xs"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      ✓
                    </motion.div>
                  )}
                  {item.isActive && !item.isCompleted && (
                    <motion.div
                      className="w-2 h-2 bg-purple-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                {/* Node Label */}
                <motion.div
                  className={`
                    mt-2 text-center max-w-20
                    ${item.isCompleted 
                      ? 'text-purple-300' 
                      : item.isActive 
                        ? 'text-purple-400' 
                        : 'text-gray-500'
                    }
                  `}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <div className="text-[10px] font-pixel leading-tight break-words">
                    {item.label}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Overall Progress Bar (if more than one item) */}
      {totalCount > 1 && (
        <div className="mt-6">
          <div className="flex justify-between text-xs font-pixel text-gray-400 mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(completionPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}