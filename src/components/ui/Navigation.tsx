import { Link } from 'react-router-dom';
import { useButtonHoverSound } from '../../hooks/useButtonHoverSound';

interface NavigationProps {
  currentChapter?: number;
  totalChapters?: number;
  showBackToHome?: boolean;
}

export function Navigation({ 
  currentChapter, 
  totalChapters, 
  showBackToHome = true 
}: NavigationProps) {
  const { playButtonSound } = useButtonHoverSound();

  const handleHover = () => {
    playButtonSound();
  };

  return (
    <div className="mb-8">
      {showBackToHome && (
        <Link 
          to="/" 
          onMouseEnter={handleHover}
          className="inline-flex items-center text-purple-300 font-pixel text-xs hover:text-purple-200 transition-colors"
        >
          ← Back to Quest Selection
        </Link>
      )}
      
      {currentChapter !== undefined && totalChapters && (
        <div className="mt-4 flex justify-between items-center">
          <div>
            {currentChapter > 0 && (
              <Link 
                to={`/chapter/${currentChapter - 1}`}
                onMouseEnter={handleHover}
                className="text-purple-300 font-pixel text-xs hover:text-purple-200 transition-colors"
              >
                ← Previous Chapter
              </Link>
            )}
          </div>
          
          <div className="text-center">
            <span className="text-purple-400 font-pixel text-xs">
              Chapter {currentChapter + 1} of {totalChapters}
            </span>
          </div>
          
          <div>
            {currentChapter < totalChapters - 1 && (
              <Link 
                to={`/chapter/${currentChapter + 1}`}
                onMouseEnter={handleHover}
                className="text-purple-300 font-pixel text-xs hover:text-purple-200 transition-colors"
              >
                Next Chapter →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}