'use client';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import SetCard from './SetCard';
import NewSetForm from './NewSetForm';
import { createClient } from '@/utils/supabase/client';

type StudySetsProps = { userId: string };

const StudySets = ({ userId }: StudySetsProps) => {
  const [sets, setSets] = useState<FlashcardSet[]>([]);

  const fetchSets = async () => {
    // Fetch sets from the database
    const supabase = createClient();

    const res = await supabase
      .from('flashcard_sets')
      .select('*')
      .eq('user_id', userId);

    setSets(res.data || []);
  };

  useEffect(() => {
    fetchSets();
  }, []);

  return (
    <section className="flex flex-col gap-12">
      <header className="flex flex-col gap-4">
        <h2 className="text-2xl">Your Sets</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="max-w-fit">Create Set</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new set</DialogTitle>
              <DialogDescription>
                Generate a new set of flashcards given a custom context.
              </DialogDescription>
            </DialogHeader>
            <NewSetForm
              userId={userId}
              className="mt-4"
              fetchSets={fetchSets}
            />
          </DialogContent>
        </Dialog>
      </header>
      {/* row of cards which represent study sets */}
      <article className="flex gap-4 overflow-x-scroll pb-4">
        {/* individual cards */}
        {sets.map((set) => {
          return <SetCard key={set.id} name={set.name} id={set.id} />;
        })}
      </article>
    </section>
  );
};

export default StudySets;
