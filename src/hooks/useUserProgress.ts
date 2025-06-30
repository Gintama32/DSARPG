import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { chapters } from '../data/chapters';

export function useUserProgress() {
  const { user } = useAuth();
  const [lessonProgress, setLessonProgress] = useState<any[]>([]);
  const [stageProgress, setStageProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch lesson and stage progress from new tables
  const fetchProgress = useCallback(async () => {
    if (!user) {
      setLessonProgress([]);
      setStageProgress([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data: lessonData, error: lessonError } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', user.id);
      if (lessonError) throw lessonError;
      setLessonProgress(lessonData || []);

      const { data: stageData, error: stageError } = await supabase
        .from('user_stage_progress')
        .select('*')
        .eq('user_id', user.id);
      if (stageError) throw stageError;
      setStageProgress(stageData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch progress');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Mark a coding stage as completed
  const completeStage = useCallback(async (chapterIndex: number, lessonIndex: number, codingStageIndex: number) => {
    if (!user) return;
    try {
      await supabase.from('user_stage_progress').upsert({
        user_id: user.id,
        chapter_index: chapterIndex,
        lesson_index: lessonIndex,
        coding_stage_index: codingStageIndex,
        completed: true,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,chapter_index,lesson_index,coding_stage_index' });
      await fetchProgress();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update stage progress');
    }
  }, [user, fetchProgress]);

  // Mark a lesson as completed
  const completeLesson = useCallback(async (chapterIndex: number, lessonIndex: number) => {
    if (!user) return;
    try {
      await supabase.from('user_lesson_progress').upsert({
        user_id: user.id,
        chapter_index: chapterIndex,
        lesson_index: lessonIndex,
        completed: true,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,chapter_index,lesson_index' });
      await fetchProgress();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lesson progress');
    }
  }, [user, fetchProgress]);

  // Check if a coding stage is completed
  const isStageCompleted = useCallback((chapterIndex: number, lessonIndex: number, codingStageIndex: number) => {
    return stageProgress.some(p =>
      p.chapter_index === chapterIndex &&
      p.lesson_index === lessonIndex &&
      p.coding_stage_index === codingStageIndex &&
      p.completed
    );
  }, [stageProgress]);

  // Check if a lesson is completed (all coding stages completed)
  const isLessonCompleted = useCallback((chapterIndex: number, lessonIndex: number) => {
    const lesson = chapters[chapterIndex].lessons[lessonIndex];
    const codingStages = lesson.stages.filter(s => s.type === 'coding');
    if (codingStages.length === 0) return true;
    return codingStages.every((_, idx) => isStageCompleted(chapterIndex, lessonIndex, idx));
  }, [isStageCompleted]);

  // Check if a lesson is unlocked (previous lesson completed or first lesson)
  const isLessonUnlocked = useCallback((chapterIndex: number, lessonIndex: number) => {
    if (lessonIndex === 0) return true;
    return lessonProgress.some(p =>
      p.chapter_index === chapterIndex &&
      p.lesson_index === lessonIndex - 1 &&
      p.completed
    );
  }, [lessonProgress]);

  // Check if a coding stage is unlocked (previous coding stage completed or first coding stage)
  const isStageUnlocked = useCallback((chapterIndex: number, lessonIndex: number, codingStageIndex: number) => {
    if (codingStageIndex === 0) return true;
    return isStageCompleted(chapterIndex, lessonIndex, codingStageIndex - 1);
  }, [isStageCompleted]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return {
    loading,
    error,
    isStageCompleted,
    isLessonCompleted,
    isLessonUnlocked,
    isStageUnlocked,
    completeStage,
    completeLesson,
    refetchProgress: fetchProgress,
    lessonProgress,
    stageProgress,
  };
}