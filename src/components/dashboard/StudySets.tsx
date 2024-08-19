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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import SetForm from '@/components/dashboard/SetForm';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { ArrowRight, ArrowUpRightFromSquare } from 'lucide-react';

type StudySetsProps = { userId: string };

const StudySets = ({ userId }: StudySetsProps) => {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSets = async () => {
    setLoading(true);

    // Fetch sets from the database
    const supabase = createClient();

    const { data, error } = await supabase
      .from('flashcard_sets')
      .select('*')
      .eq('user_id', userId)
      .order('last_used', { ascending: false });

    setSets(data || []);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch sets. Please try again.',
        variant: 'destructive'
      });
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSets();
  }, []);

  const updateLastUse = async (id: number) => {
    const supabase = createClient();
    await supabase
      .from('flashcard_sets')
      .update({ last_used: new Date().toString() })
      .eq('id', id);
  };

  const deleteSet = async (id: number) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('flashcard_sets')
      .delete()
      .eq('id', id);
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete set. Please try again.',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Success',
        description: 'Set deleted successfully'
      });
      fetchSets();
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between gap-4">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const supabase = createClient();

            const { data, error } = await supabase
              .from('flashcard_sets')
              .select('*')
              .eq('user_id', userId)
              .ilike('name', `%${search}%`)
              .order('last_used', { ascending: false });
            setSets(data || []);
            console.log(error);
          }}
          className="flex items-center gap-1"
        >
          <Input
            className=" rounded-l-md rounded-r-none"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <Button
            asChild
            type="submit"
            className="bg-accent p-2 rounded-l-none rounded-r-md text-foreground"
          >
            <ArrowRight className="size-9 " />
          </Button>
        </form>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="max-w-fit">
              Create Set
            </Button>
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
              fetchSets={fetchSets}
              type="create"
              className="mt-4 space-y-4"
            />
          </DialogContent>
        </Dialog>
      </div>
      {/* row of cards which represent study sets */}
      <article className="flex flex-col gap-4 border rounded-md p-6 overflow-y-auto max-h-[40%]">
        <div>
          <h1 className="font-semibold text-2xl">Your sets</h1>
          <h2 className="text-foreground/40">
            See all of your flashcard sets. Right click to edit row.
          </h2>
        </div>
        {/* individual cards */}
        {loading ? (
          [1, 2, 3].map((key) => {
            return (
              <Skeleton key={key} className="w-full h-8 border rounded-md" />
            );
          })
        ) : sets.length !== 0 ? (
          <Table>
            <TableCaption className="hidden">
              See all of your flashcard sets. Right click to edit row.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Set Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Last Opened</TableHead>
                <TableHead className="text-right">Open</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sets.map((set) => {
                return (
                  <Dialog key={set.id}>
                    <ContextMenu>
                      <ContextMenuTrigger asChild>
                        <TableRow>
                          <TableCell>{set.name}</TableCell>
                          <TableCell>{set.description}</TableCell>
                          <TableCell>
                            {set.last_used
                              ? new Date(set.last_used).toLocaleString(
                                  'en-US',
                                  {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true
                                  }
                                )
                              : 'Never'}
                          </TableCell>
                          <TableCell className="flex justify-end">
                            <Link
                              href={`/dashboard/${set.id}`}
                              onClick={() => updateLastUse(set.id)}
                            >
                              <ArrowUpRightFromSquare className="hover:text-blue-400 transition-colors" />
                            </Link>
                          </TableCell>
                        </TableRow>
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
            </TableBody>
          </Table>
        ) : (
          <em>No sets found.</em>
        )}
      </article>
    </section>
  );
};

export default StudySets;
