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
import { cn } from '@/utils/cn';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'The set name must be at least 2 characters.'
  }),
  description: z.string().optional(),
  context: z.string().min(2, {
    message: 'The context must be at least 2 characters.'
  })
});

type NewSetFormProps = {
  userId: string;
  className?: string;
  fetchSets: () => void;
};

export default function NewSetForm({
  userId,
  className,
  fetchSets
}: NewSetFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Form definition
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      context: ''
    }
  });

  // Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient();

    setLoading(true);
    toast({
      title: 'Creating Flashcards...',
      description: 'Please wait while we generate your flashcards.'
    });

    const { data, error } = await supabase
      .from('flashcard_sets')
      .insert({
        user_id: userId,
        name: values.name,
        description: values.description
      })
      .select('id');

    const cards = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: values.context }]
      }),
      headers: { 'Content-Type': 'application/json' }
    }).then((res) => res.json());

    if (cards?.flashcards && data) {
      const cardsData = cards.flashcards.map((card: any) => ({
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
      toast({
        title: 'Success',
        description: 'Flashcards created successfully! '
      });
      fetchSets();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to create flashcards. Please try again.'
      });
    }

    setLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-8', className)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Set Name</FormLabel>
              <FormControl>
                <Input placeholder="Calculus 1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Calc 1 midterm review" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="context"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Context</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Topcis: Limits, Derivatives, methods of derivation, applications of derivatives, integrals, methods of integration, applications of integrals, integral revolutions, sequences, series, power series, Taylor series."
                  className="resize-none min-h-48"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Set'}
        </Button>
      </form>
    </Form>
  );
}
