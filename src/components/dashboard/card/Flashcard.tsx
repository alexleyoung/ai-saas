'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/utils/supabase/client';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

type FlashcardProps = {
  setId: string;
};

const Flashcard = ({ setId }: FlashcardProps) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [cardIdx, setCardIdx] = useState(0);
  const [side, setSide] = useState<'q' | 'a'>('q');
  const [loading, setLoading] = useState(true);

  const fetchFlashcards = async () => {
    setLoading(true);

    // Fetch flashcards from the database
    const supabase = createClient();

    const { data, error } = await supabase
      .from('flashcards')
      .select()
      .eq('set_id', setId);

    setFlashcards(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* card box */}
      {loading ? (
        <Skeleton className="w-96 h-64" />
      ) : (
        <div
          className="w-96 h-64 bg-accent p-8 grid place-items-center text-center rounded-md shadow-md text-lg"
          onClick={() => {
            setSide(side === 'q' ? 'a' : 'q');
          }}
        >
          {side === 'q'
            ? flashcards[cardIdx].question
            : flashcards[cardIdx].answer}
        </div>
      )}
      {/* pagination */}
      <div className="flex justify-between w-40 scale-125">
        <ArrowLeftCircle
          className={`transition-colors ${cardIdx === 0 ? 'text-primary/40' : 'hover:text-blue-500'}`}
          onClick={() => {
            cardIdx === 0 ? '' : setCardIdx((idx) => idx - 1);
            setSide('q');
          }}
        />
        <p>{`${cardIdx + 1}/${flashcards.length}`}</p>
        <ArrowRightCircle
          className={`transition-colors ${cardIdx === flashcards.length - 1 ? 'text-primary/40' : 'hover:text-blue-500'}`}
          onClick={() => {
            cardIdx === flashcards.length - 1
              ? ''
              : setCardIdx((idx) => idx + 1);
            setSide('q');
          }}
        />
      </div>
    </div>
  );
};

export default Flashcard;
