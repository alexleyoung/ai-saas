'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import SetCard from './SetCard';
import SetForm from './SetForm';

type StudySetsProps = { userId: string };

const StudySets = ({ userId }: StudySetsProps) => {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSets = async () => {
    setLoading(true);

    // Fetch sets from the database
    const supabase = createClient();

    const res = await supabase
      .from('flashcard_sets')
      .select('*')
      .eq('user_id', userId);

    setSets(res.data?.reverse() || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSets();
  }, []);

  const updateLastUee = async (id: number) => {
    const supabase = createClient();
    await supabase
      .from('flashcard_sets')
      .update({ last_used: new Date().toISOString() })
      .eq('id', id);
  };

  const deleteSet = async (id: number) => {
    const supabase = createClient();
    await supabase.from('flashcard_sets').delete().eq('id', id);
    fetchSets();
  };

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
            <SetForm
              userId={userId}
              className="mt-4"
              fetchSets={fetchSets}
              type="create"
            />
          </DialogContent>
        </Dialog>
      </header>
      {/* row of cards which represent study sets */}
      <article className="flex gap-4 overflow-x-scroll pb-12">
        {/* individual cards */}
        {loading
          ? [1, 2, 3, 4, 5, 6, 7].map((key) => {
              return (
                <Skeleton
                  key={key}
                  className="min-w-64 h-64 border rounded-md"
                />
              );
            })
          : sets.map((set) => {
              return (
                <Dialog key={set.id}>
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <SetCard
                        name={set.name}
                        id={set.id}
                        update={() => {
                          updateLastUee(set.id);
                        }}
                      />
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem>
                        <DialogTrigger>Edit</DialogTrigger>
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => deleteSet(set.id)}>
                        Delete
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Set</DialogTitle>
                      <DialogDescription className="hidden" />
                    </DialogHeader>
                    <SetForm
                      userId={userId}
                      type="update"
                      set={set}
                      fetchSets={fetchSets}
                      className="space-y-4"
                    />
                  </DialogContent>
                </Dialog>
              );
            })}
      </article>
    </section>
  );
};

export default StudySets;
