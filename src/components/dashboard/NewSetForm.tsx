'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';

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
import { cn } from '@/utils/cn';
import { createClient } from '@/utils/supabase/client';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'The set name must be at least 2 characters.'
  }),
  description: z.string().optional(),
  context: z.string().min(2, {
    message: 'The context must be at least 2 characters.'
  })
});

type NewSetFormProps = { userId: string; className?: string };

export default function NewSetForm({ userId, className }: NewSetFormProps) {
  const [loading, setLoading] = useState(false);

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
    const { error } = await supabase.from('flashcard_sets').insert({
      user_id: userId,
      name: values.name,
      description: values.description
    });

    const cards = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: values.context }]
      }),
      headers: { 'Content-Type': 'application/json' }
    }).then((res) => res.json());

    console.log(cards);
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
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
