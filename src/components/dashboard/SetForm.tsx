'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'The set name must be at least 2 characters.'
  }),
  description: z.string().optional(),
  context: z.string().optional()
});

type SetFormProps = {
  userId: string;
  className?: string;
  type?: 'create' | 'update';
  set?: FlashcardSet;
  fetchSets: () => void;
};

export default function SetForm({
  userId,
  className,
  type,
  set,
  fetchSets
}: SetFormProps) {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<
    { question: string; answer: string }[] | null
  >(null);
  const [setName, setSetName] = useState('');
  const [setDescription, setSetDescription] = useState('');
  const { toast } = useToast();

  // Form definition
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: set ? set.name : '',
      description: set?.description ? set.description : '',
      context: ''
    }
  });

  // chat with ai
  const chat = async (context: string) => {
    setLoading(true);
    const data: aiChat = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: context }]
      }),
      headers: { 'Content-Type': 'application/json' }
    }).then((res) => res.json());
    setLoading(false);
    console.log(data);
    return data || null;
  };

  // save set to DB
  const saveSet = async () => {
    setLoading(true);
    toast({
      title: 'Saving Flashcards...',
      description: 'Please wait while we save your flashcards.'
    });
    const supabase = createClient();
    // create new set
    const { data, error } = await supabase
      .from('flashcard_sets')
      .insert({
        user_id: userId,
        name: setName,
        description: setDescription
      })
      .select('id');

    // save cards
    if (cards && data) {
      const cardsData = cards.map((card: any) => ({
        set_id: Number(data[0].id),
        user_id: userId,
        question: card.question,
        answer: card.answer
      }));

      cardsData.forEach(
        async (cardData: {
          set_id: number;
          user_id: string;
          question: string;
          answer: string;
        }) => {
          await supabase.from('flashcards').insert(cardData);
        }
      );
    } else if (!cards) {
      toast({
        title: 'Error',
        description:
          'No flashcards to save! Generate some first before saving.',
        variant: 'destructive'
      });
    } else if (error) {
      toast({
        title: 'Error',
        description: 'Failed to save flashcards. Please try again.',
        variant: 'destructive'
      });
    }
    await fetchSets();
    toast({
      title: 'Success!',
      description: 'Flashcards saved successfully.'
    });
    setLoading(false);
  };

  // Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient();

    setLoading(true);
    if (type === 'create') {
      toast({
        title: 'Creating Flashcards...',
        description: 'Please wait while we generate your flashcards.'
      });
    } else {
      toast({
        title: 'Updating Flashcards...',
        description: 'Please wait while we update your flashcards.'
      });
    }

    if (type === 'create') {
      if (!values.context) {
        toast({
          title: 'Error',
          description: 'Please provide a context to generate flashcards.',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      // generate cards and update state
      setSetName(values.name);
      setSetDescription(values.description || '');
      const { flashcards } = await chat(values.context);
      setCards(flashcards);

      if (flashcards === null) {
        toast({
          title: 'Error',
          description: 'Failed to generate flashcards. Please try again.',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      } else {
        toast({
          title: 'Success!',
          description: 'Flashcards generated successfully.'
        });
      }
    } else if (type === 'update') {
      const { error } = await supabase
        .from('flashcard_sets')
        .update({
          name: values.name,
          description: values.description || '',
          last_used: new Date().toISOString()
        })
        .eq('id', set?.id!);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update flashcards. Please try again.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Success!',
          description: 'Flashcards updated successfully.'
        });

        fetchSets();
      }
    }

    setLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-8', className)}
      >
        {/* name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Set Name</FormLabel>
              <FormControl>
                <Input placeholder={set ? '' : 'Calc 1'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* description (optional) */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder={set ? '' : 'Calc 1 midterm review'}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* context */}
        {type === 'create' && (
          <FormField
            control={form.control}
            name="context"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Context</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Topcis: Limits, Derivatives, methods of derivation, applications of derivatives, integrals, methods of integration, applications of integrals, integral revolutions, sequences, series, power series, Taylor series."
                    className="resize-none min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {/* preview */}
        <div className="flex flex-col border p-4 rounded-md h-64 overflow-y-scroll">
          {loading ? (
            <div className="flex flex-col gap-2 my-4 overflow-y-hidden">
              <Skeleton className="w-full h-20" />
              <Skeleton className="w-full h-20" />
              <Skeleton className="w-full h-20" />
            </div>
          ) : cards ? (
            cards.map((card, idx) => {
              return (
                <div key={idx} className="flex flex-col gap-2 my-4">
                  <h3 className="font-semibold">Card {idx + 1}</h3>
                  <p>{'q: ' + card.question}</p>
                  <p>{'a: ' + card.answer}</p>
                </div>
              );
            })
          ) : (
            <em className="text-gray-400 grid place-items-center h-64">
              Preview
            </em>
          )}
        </div>
        {/* buttons */}
        <div className="flex justify-between w-full">
          <Button type="submit" disabled={loading}>
            {loading
              ? type === 'create'
                ? 'Generating...'
                : 'Updating...'
              : type === 'create'
                ? 'Preview'
                : 'Save'}
          </Button>
          {type === 'create' && (
            <Button
              onClick={async () => {
                await saveSet();
              }}
              disabled={loading}
            >
              Save
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
