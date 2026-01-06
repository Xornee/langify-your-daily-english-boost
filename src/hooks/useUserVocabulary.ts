import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type VocabularyItem = Database['public']['Tables']['vocabulary_items']['Row'];
type UserVocabulary = Database['public']['Tables']['user_vocabulary']['Row'];

export interface UserVocabularyWithItem extends UserVocabulary {
  vocabulary_items: VocabularyItem;
}

export function useUserVocabulary(userId: string | undefined) {
  const [vocabulary, setVocabulary] = useState<UserVocabularyWithItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVocabulary = useCallback(async () => {
    if (!userId) {
      setVocabulary([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('user_vocabulary')
      .select(`
        *,
        vocabulary_items (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setVocabulary((data as UserVocabularyWithItem[]) || []);
    }
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchVocabulary();
  }, [fetchVocabulary]);

  const addToVocabulary = async (vocabularyId: string) => {
    if (!userId) return false;

    const { error } = await supabase
      .from('user_vocabulary')
      .insert({
        user_id: userId,
        vocabulary_id: vocabularyId,
        added_manually: true,
      });

    if (error) {
      if (error.code === '23505') {
        // Already exists, not an error
        return true;
      }
      console.error('Error adding vocabulary:', error);
      return false;
    }

    await fetchVocabulary();
    return true;
  };

  const removeFromVocabulary = async (vocabularyId: string) => {
    if (!userId) return false;

    const { error } = await supabase
      .from('user_vocabulary')
      .delete()
      .eq('user_id', userId)
      .eq('vocabulary_id', vocabularyId);

    if (error) {
      console.error('Error removing vocabulary:', error);
      return false;
    }

    await fetchVocabulary();
    return true;
  };

  const updateStrength = async (vocabularyId: string, strength: number) => {
    if (!userId) return false;

    const { error } = await supabase
      .from('user_vocabulary')
      .update({ 
        strength,
        last_seen_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('vocabulary_id', vocabularyId);

    if (error) {
      console.error('Error updating strength:', error);
      return false;
    }

    return true;
  };

  return {
    vocabulary,
    isLoading,
    error,
    addToVocabulary,
    removeFromVocabulary,
    updateStrength,
    refetch: fetchVocabulary,
  };
}