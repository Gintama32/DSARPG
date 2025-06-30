import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { TestCase } from '../../data/chapters';

interface TestResult {
  index: number;
  passed: boolean;
  input: any[];
  expectedOutput: any;
  actualOutput: any;
  description: string;
  error: string | null;
}

type TestRunStatus = 'idle' | 'running' | 'progress_animating' | 'passed_displaying_victory' | 'failed';

interface TestResultsProps {
  testCases: TestCase[];
  results: TestResult[];
  height?: string;
  testRunStatus: TestRunStatus;
  onTestComplete?: () => void;
}

export function TestResults({ 
  testCases, 
  results, 
  height = '300px', 
  testRunStatus,
  onTestComplete 
}: TestResultsProps) {
  const [showProgressAnimation, setShowProgressAnimation] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [showVictoryMessage, setShowVictoryMessage] = useState(false);

  const formatValue = (value: any): string => {
    if (value === null) return 'None';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${value}"`;
    if (Array.isArray(value)) return `[${value.map(formatValue).join(', ')}]`;
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const passedCount = results.filter(r => r.passed).length;
  const totalCount = testCases.length;

  // Handle test status changes and progress animation
  useEffect(() => {
    if (testRunStatus === 'progress_animating') {
      setShowProgressAnimation(true);
      setProgressPercent(0);
      setShowVictoryMessage(false);

      // Animate progress bar to sync with 6-second test_case_pass.mp3 sound
      const animationDuration = 6000; // 6 seconds to match the sound
      const steps = 120; // More steps for smoother animation
      const stepDuration = animationDuration / steps;

      let currentStep = 0;
      const progressInterval = setInterval(() => {
        currentStep++;
        const progress = (currentStep / steps) * 100;
        setProgressPercent(progress);

        if (currentStep >= steps) {
          clearInterval(progressInterval);
          
          // Notify parent that animation is complete
          setTimeout(() => {
            onTestComplete?.();
          }, 100);
        }
      }, stepDuration);

      return () => {
        clearInterval(progressInterval);
      };
    } else if (testRunStatus === 'passed_displaying_victory') {
      setShowProgressAnimation(false);
      setShowVictoryMessage(true);
    } else {
      // For 'idle', 'running', 'failed' states
      setShowProgressAnimation(false);
      setProgressPercent(0);
      setShowVictoryMessage(false);
    }
  }, [testRunStatus, onTestComplete]);

  return (
    <div 
      className="bg-gray-800 border border-purple-500/30 rounded p-4 overflow-y-auto"
      style={{ height }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-600">
        <div className="text-sm font-pixel text-purple-400">Test Results</div>
        {results.length > 0 && testRunStatus !== 'progress_animating' && testRunStatus !== 'running' && (
          <div className={`text-xs font-pixel ${passedCount === totalCount ? 'text-green-400' : 'text-yellow-400'}`}>
            {passedCount}/{totalCount} passed
          </div>
        )}
      </div>

      {/* Loading Animation */}
      <AnimatePresence>
        {testRunStatus === 'running' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-purple-400 text-2xl mb-2"
            >
              ⚙️
            </motion.div>
            <div className="text-purple-300 text-xs font-pixel">
              Running tests...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Animation - 6 seconds to sync with test_case_pass.mp3 */}
      <AnimatePresence>
        {showProgressAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-8"
          >
            <motion.div
              className="text-green-400 text-3xl mb-4"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🧪
            </motion.div>
            
            <div className="text-green-300 text-sm font-pixel mb-4">
              Processing Test Results...
            </div>

            {/* Progress Bar - Synchronized with 6-second audio */}
            <div className="w-full bg-gray-700 rounded-full h-4 mb-4 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                style={{ width: `${progressPercent}%` }}
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(34, 197, 94, 0.5)",
                    "0 0 20px rgba(34, 197, 94, 0.8)",
                    "0 0 10px rgba(34, 197, 94, 0.5)"
                  ]
                }}
                transition={{
                  boxShadow: {
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              />
            </div>

            <div className="text-green-200 text-xs font-pixel">
              {Math.round(progressPercent)}% Complete
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Victory Message - Only shown after progress animation completes */}
      <AnimatePresence>
        {showVictoryMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0,
              boxShadow: [
                "0 0 0px rgba(34, 197, 94, 0)",
                "0 0 30px rgba(34, 197, 94, 0.6)",
                "0 0 50px rgba(34, 197, 94, 0.4)",
                "0 0 30px rgba(34, 197, 94, 0.6)"
              ]
            }}
            transition={{ 
              duration: 0.8,
              boxShadow: { duration: 2, repeat: Infinity }
            }}
            className="text-center py-6 bg-gradient-to-br from-green-900/30 to-blue-900/20 border-2 border-green-500/50 rounded-lg"
          >
            <motion.div 
              className="text-green-400 text-4xl mb-3"
              animate={{ 
                scale: [1, 1.3, 1.1, 1.3, 1],
                rotate: [0, 10, -10, 5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              🎉
            </motion.div>
            
            <motion.div 
              className="text-green-300 text-lg font-pixel mb-2"
              animate={{
                textShadow: [
                  "0 0 8px rgba(34, 197, 94, 0.6)",
                  "0 0 16px rgba(34, 197, 94, 0.8)",
                  "0 0 8px rgba(34, 197, 94, 0.6)"
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Victory Achieved!
            </motion.div>
            
            <div className="text-green-200 text-sm font-pixel mb-2">
              All tests passed successfully!
            </div>
            
            <div className="text-green-300 text-xs font-pixel">
              The algorithms bow to your mastery, Chosen One! ⚔️
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results Message */}
      {results.length === 0 && testRunStatus === 'idle' && (
        <div className="text-center py-8">
          <div className="text-gray-500 text-sm font-pixel mb-2">🐍</div>
          <div className="text-gray-400 text-xs font-pixel">
            Click "Run Tests" to see results
          </div>
        </div>
      )}

      {/* Failed Tests Summary - Only show when tests failed */}
      {testRunStatus === 'failed' && results.length > 0 && (
        <div className="space-y-3">
          <div className="text-center py-4 bg-red-900/20 border border-red-500/30 rounded">
            <div className="text-red-400 text-lg mb-2">❌</div>
            <div className="text-red-300 text-sm font-pixel mb-1">
              {passedCount}/{totalCount} tests passed
            </div>
            <div className="text-red-200 text-xs font-pixel">
              Review your code and try again!
            </div>
          </div>

          {/* Show failed test details */}
          {results.filter(r => !r.passed).map((result, index) => (
            <motion.div
              key={result.index}
              className="bg-red-900/20 border border-red-500/30 rounded p-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-xs font-pixel text-red-300 mb-2">
                ❌ Test Case {result.index + 1} Failed
              </div>
              
              <div className="text-xs font-pixel text-gray-400 mb-2">
                {testCases[result.index].description}
              </div>

              {result.error && (
                <div className="text-xs font-mono text-red-200 bg-red-900/30 p-2 rounded">
                  Error: {result.error}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}