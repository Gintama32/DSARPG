import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lesson, Stage, getStageNumber, getTotalStagesInChapter, getGlobalCodingStageNumber } from '../data/chapters';
import { PixelButton } from './ui/PixelButton';
import { PixelCard } from './ui/PixelCard';
import { CodeEditor } from './ui/CodeEditor';
import { TestResults } from './ui/TestResults';
import { useButtonClickSound } from '../hooks/useButtonClickSound';
import { useTestPassSound } from '../hooks/useTestPassSound';
import { useWinSound } from '../hooks/useWinSound';
import { useUserProgress } from '../hooks/useUserProgress';

interface LessonStageViewerProps {
  lesson: Lesson;
  chapterIndex: number;
  lessonIndex: number;
  onReturn: () => void;
}

type TestRunStatus = 'idle' | 'running' | 'progress_animating' | 'passed_displaying_victory' | 'failed';

export function LessonStageViewer({ lesson, chapterIndex, lessonIndex, onReturn }: LessonStageViewerProps) {
  // Find the first coding stage index
  const firstCodingStageIndex = lesson.stages.findIndex(stage => stage.type === 'coding');
  const [currentStageIndex, setCurrentStageIndex] = useState(firstCodingStageIndex !== -1 ? firstCodingStageIndex : 0);
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testRunStatus, setTestRunStatus] = useState<TestRunStatus>('idle');
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const { playGeneralButtonSound } = useButtonClickSound();
  const { playTestPassSound } = useTestPassSound();
  const { playWinSound } = useWinSound();
  const codeEditorRef = useRef<any>(null);
  const { isStageCompleted, isStageUnlocked, completeStage, completeLesson, isLessonCompleted } = useUserProgress();

  const currentStage = lesson.stages[currentStageIndex];
  const isFirstStage = currentStageIndex === 0;
  const isLastStage = currentStageIndex === lesson.stages.length - 1;
  
  // Get continuous stage numbering
  const currentStageNumber = getStageNumber(chapterIndex, lessonIndex, currentStageIndex);
  const totalStagesInChapter = getTotalStagesInChapter(chapterIndex);

  // Build an array of coding stage indices for this lesson
  const codingStageIndices = lesson.stages
    .map((stage, idx) => (stage.type === 'coding' ? idx : null))
    .filter(idx => idx !== null) as number[];

  // Find the current position in the codingStageIndices array
  const currentCodingStagePos = codingStageIndices.indexOf(currentStageIndex);

  // For display: stage number (1-based, only coding stages)
  const displayStageNumber = currentCodingStagePos + 1;
  const totalCodingStages = codingStageIndices.length;

  // Find the next/previous coding stage indices
  const nextCodingStageIndex =
    currentCodingStagePos !== -1 && currentCodingStagePos + 1 < codingStageIndices.length
      ? codingStageIndices[currentCodingStagePos + 1]
      : null;
  const prevCodingStageIndex =
    currentCodingStagePos !== -1 && currentCodingStagePos > 0
      ? codingStageIndices[currentCodingStagePos - 1]
      : null;

  // Only allow Next if the next coding stage is unlocked
  const canGoNext = nextCodingStageIndex !== null && isStageUnlocked(chapterIndex, lessonIndex, codingStageIndices.indexOf(nextCodingStageIndex));
  const canGoPrev = prevCodingStageIndex !== null;

  // When a coding stage is completed, mark it in the DB
  const handleStageComplete = async () => {
    // Use the coding stage index in the coding stages array
    const codingStageIdx = codingStageIndices.findIndex(idx => idx === currentStageIndex);
    if (codingStageIdx !== -1 && !isStageCompleted(chapterIndex, lessonIndex, codingStageIdx)) {
      await completeStage(chapterIndex, lessonIndex, codingStageIdx);
    }
    // If this was the last coding stage, also mark lesson as completed
    if (codingStageIdx === codingStageIndices.length - 1) {
      await completeLesson(chapterIndex, lessonIndex);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (canGoNext && nextCodingStageIndex !== null) {
      playGeneralButtonSound();
      setCurrentStageIndex(nextCodingStageIndex);
    }
  };
  const handlePrev = () => {
    if (canGoPrev && prevCodingStageIndex !== null) {
      playGeneralButtonSound();
      setCurrentStageIndex(prevCodingStageIndex);
    }
  };

  // On mount, start at the first coding stage
  useEffect(() => {
    if (codingStageIndices.length > 0) {
      setCurrentStageIndex(codingStageIndices[0]);
    }
  }, [lesson]);

  // When moving to a new coding stage, reset code editor and test results
  useEffect(() => {
    if (currentStage.type === 'coding') {
      setCode(currentStage.starterCode || '');
      setTestResults([]);
      setTestRunStatus('idle');
    } else {
      setCode('');
      setTestResults([]);
      setTestRunStatus('idle');
    }
  }, [currentStageIndex, lesson]);

  const handleRunTests = async () => {
    if (currentStage.type !== 'coding') return;
    
    playGeneralButtonSound();
    setTestRunStatus('running');
    setTestResults([]);
    
    try {
      // Extract function name from the code
      const functionMatch = code.match(/function\s+(\w+)\s*\(/);
      if (!functionMatch) {
        throw new Error('Function definition not found. Make sure your function is properly defined.');
      }
      
      const functionName = functionMatch[1];
      
      const results = await Promise.all(
        currentStage.testCases.map(async (testCase, index) => {
          try {
            // Create a safe execution environment
            const testFunction = new Function('return ' + code)();
            
            // Get the function from the returned object or directly if it's a function
            const userFunction = typeof testFunction === 'function' ? testFunction : testFunction[functionName];
            
            if (typeof userFunction !== 'function') {
              throw new Error(`Function ${functionName} not found or not properly exported`);
            }

            // Run the test
            const result = userFunction(...testCase.input);
            
            // Compare results - handle different data types properly
            let passed = false;
            try {
              if (
                (typeof testCase.expectedOutput === 'object' && testCase.expectedOutput !== null) ||
                (typeof result === 'object' && result !== null)
              ) {
                passed = JSON.stringify(testCase.expectedOutput) === JSON.stringify(result);
              } else {
                passed = testCase.expectedOutput === result;
              }
            } catch (e) {
              passed = String(testCase.expectedOutput) === String(result);
            }
            
            return {
              index,
              passed,
              input: testCase.input,
              expectedOutput: testCase.expectedOutput,
              actualOutput: result,
              description: testCase.description,
              error: null
            };
          } catch (error) {
            console.error('Test execution error:', error);
            return {
              index,
              passed: false,
              input: testCase.input,
              expectedOutput: testCase.expectedOutput,
              actualOutput: null,
              description: testCase.description,
              error: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        })
      );
      
      setTestResults(results);
      
      // Check if all tests passed
      const allTestsPassed = results.every(r => r.passed);
      
      if (allTestsPassed) {
        // Start progress animation and play test pass sound
        setTestRunStatus('progress_animating');
        playTestPassSound();
        
        // Update user progress in database (only for coding stages)
        try {
          await handleStageComplete();
          console.log('Progress updated successfully');
        } catch (error) {
          console.error('Failed to update progress:', error);
        }
      } else {
        // Tests failed
        setTestRunStatus('failed');
      }
    } catch (error) {
      console.error('General test error:', error);
      // Handle general errors
      const errorResults = currentStage.testCases.map((testCase, index) => ({
        index,
        passed: false,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: null,
        description: testCase.description,
        error: error instanceof Error ? error.message : 'Code execution error'
      }));
      
      setTestResults(errorResults);
      setTestRunStatus('failed');
    }
  };

  const handleShowHints = () => {
    playGeneralButtonSound();
    setShowHints(!showHints);
  };

  const handleShowSolution = () => {
    playGeneralButtonSound();
    setShowSolution(!showSolution);
  };

  const handleTestResultsAnimationComplete = () => {
    // Called when the 6-second progress animation finishes
    playWinSound();
    setTestRunStatus('passed_displaying_victory');
  };

  const renderTextStage = (stage: Stage & { type: 'text' }) => (
    <div className="w-full">
      <PixelCard className="p-8" hoverable={false}>
        <div className="text-center mb-6">
          <motion.h2 
            className="text-xl font-pixel text-purple-400 mb-6 leading-relaxed"
            animate={{
              textShadow: [
                "0 0 8px rgba(168, 85, 247, 0.6)",
                "0 0 12px rgba(168, 85, 247, 0.8)",
                "0 0 8px rgba(168, 85, 247, 0.6)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {stage.title}
          </motion.h2>
          
          <div className="text-sm font-pixel text-gray-200 leading-relaxed text-left max-w-4xl mx-auto">
            {stage.content}
          </div>
        </div>
      </PixelCard>
    </div>
  );

  const renderCodingStage = (stage: Stage & { type: 'coding' }) => (
    <div className="w-full">
      {/* Stage Completion Status */}
      {isStageCompleted(chapterIndex, lessonIndex, currentStageIndex) && (
        <PixelCard className="p-4 mb-6 bg-green-900/20 border-green-500/30" hoverable={false}>
          <div className="flex items-center justify-center space-x-3">
            <span className="text-green-400 text-lg">✅</span>
            <div className="text-green-300 text-sm font-pixel">
              Stage completed! Well done, Chosen One.
            </div>
          </div>
        </PixelCard>
      )}

      {/* Problem Description */}
      <PixelCard className="p-6 mb-6" hoverable={false}>
        <motion.h2 
          className="text-lg font-pixel text-purple-400 mb-4 leading-relaxed"
          animate={{
            textShadow: [
              "0 0 8px rgba(168, 85, 247, 0.6)",
              "0 0 12px rgba(168, 85, 247, 0.8)",
              "0 0 8px rgba(168, 85, 247, 0.6)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🚀 {stage.title}
        </motion.h2>
        
        <div className="text-sm font-pixel text-gray-200 leading-relaxed mb-4">
          {stage.description}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <PixelButton
            onClick={handleRunTests}
            variant="primary"
            className="px-6"
            disabled={testRunStatus === 'running'}
          >
            {testRunStatus === 'running' ? '⚙️ Running...' : '🚀 Run Tests'}
          </PixelButton>
          
          {stage.hints && stage.hints.length > 0 && (
            <PixelButton
              onClick={handleShowHints}
              variant="secondary"
              className="px-6"
            >
              💡 {showHints ? 'Hide Hints' : 'Show Hints'}
            </PixelButton>
          )}
          
          {stage.solution && (
            <PixelButton
              onClick={handleShowSolution}
              variant="secondary"
              className="px-6"
            >
              🔍 {showSolution ? 'Hide Solution' : 'Show Solution'}
            </PixelButton>
          )}
        </div>

        {/* Hints */}
        <AnimatePresence>
          {showHints && stage.hints && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded"
            >
              <div className="text-sm font-pixel text-blue-300 mb-2">💡 Hints:</div>
              <ul className="text-xs font-pixel text-gray-300 leading-relaxed space-y-1">
                {stage.hints.map((hint, index) => (
                  <li key={index}>• {hint}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Solution */}
        <AnimatePresence>
          {showSolution && stage.solution && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-green-900/20 border border-green-500/30 rounded"
            >
              <div className="text-sm font-pixel text-green-300 mb-2">🔍 Solution:</div>
              <pre className="text-xs font-mono text-gray-300 bg-gray-800 p-3 rounded overflow-x-auto">
                {stage.solution}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </PixelCard>

      {/* Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Code Editor */}
        <PixelCard className="p-4" hoverable={false}>
          <div className="text-sm font-pixel text-purple-400 mb-3">🚀 JavaScript Code Editor</div>
          {currentStage.type === 'coding' && currentStage.starterCode && (
            <div className="mb-2 p-2 bg-gray-800 border border-purple-500/20 rounded text-xs font-mono text-purple-300">
              {/* Show the function signature as a frame */}
              {currentStage.starterCode.split('\n')[0]}
            </div>
          )}
          <CodeEditor
            ref={codeEditorRef}
            value={code}
            onChange={setCode}
            language="javascript"
            height="400px"
          />
        </PixelCard>

        {/* Right Panel - Test Results */}
        <PixelCard className="p-4" hoverable={false}>
          <div className="text-sm font-pixel text-purple-400 mb-3">Test Cases & Results</div>
          <TestResults
            testCases={currentStage.type === 'coding' && Array.isArray(currentStage.testCases) ? currentStage.testCases : []}
            results={testResults}
            height="400px"
            testRunStatus={testRunStatus}
            onTestComplete={handleTestResultsAnimationComplete}
          />
        </PixelCard>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden p-4">
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Lesson Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-pixel text-purple-400 mb-2 leading-relaxed">
            {lesson.name}
          </h1>
          <p className="text-sm font-pixel text-purple-300 leading-relaxed mb-2">
            {lesson.description}
          </p>
          <div className="text-xs font-pixel text-gray-400">
            Stage {displayStageNumber} of {totalCodingStages} in this lesson
            {currentStage.type === 'coding' && isStageCompleted(chapterIndex, lessonIndex, currentCodingStagePos) && (
              <span className="text-green-400 ml-2">✓ Completed</span>
            )}
          </div>
        </motion.div>

        {/* Stage Content */}
        <motion.div
          key={currentStageIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          {currentStage.type === 'text' ? renderTextStage(currentStage as Stage & { type: 'text' }) : null}
          {currentStage.type === 'coding' ? renderCodingStage(currentStage as Stage & { type: 'coding' }) : null}
        </motion.div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center">
          <PixelButton
            onClick={handlePrev}
            variant="secondary"
            disabled={!canGoPrev}
          >
            ← Previous
          </PixelButton>

          <div className="flex items-center space-x-4">
            {/* Stage Progress */}
            <div className="text-xs font-pixel text-purple-300">
              Stage {displayStageNumber} of {totalCodingStages}
            </div>
            
            {/* Stage Indicators */}
            <div className="flex space-x-2">
              {codingStageIndices.map((stageIdx, pos) => {
                const stageCompleted = isStageCompleted(chapterIndex, lessonIndex, pos);
                return (
                  <div
                    key={stageIdx}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      pos === currentCodingStagePos
                        ? 'bg-purple-400'
                        : stageCompleted
                          ? 'bg-green-500'
                          : pos < currentCodingStagePos
                            ? 'bg-purple-600'
                            : 'bg-gray-600'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {isLastStage ? (
            (() => {
              const codingStages = lesson.stages.filter(s => s.type === 'coding');
              const lastCodingStageIdx = codingStages.length - 1;
              return (
                <PixelButton
                  onClick={onReturn}
                  variant="primary"
                  disabled={codingStages.length === 0 || !isStageCompleted(chapterIndex, lessonIndex, lastCodingStageIdx)}
                >
                  Complete Lesson
                </PixelButton>
              );
            })()
          ) : (
            <PixelButton
              onClick={handleNext}
              variant="primary"
              disabled={!canGoNext}
            >
              Next →
            </PixelButton>
          )}
        </div>

        {/* Return to Lessons Button */}
        <div className="text-center mt-8">
          <PixelButton
            onClick={onReturn}
            variant="secondary"
            className="px-8"
          >
            ← Back to Lessons
          </PixelButton>
        </div>
      </div>
    </div>
  );
}