import { createClient } from '@/utils/supabase/server';

import Flashcard from '@/components/dashboard/card/Flashcard';

export default async function page({ params }: { params: { set: string } }) {
  // get set from DB
  const supabase = createClient();
  const { data, error } = await supabase
    .from('flashcard_sets')
    .select()
    .eq('id', params.set);

  return (
    <section className="text-foreground py-6 px-12 flex flex-col gap-12">
      <header className="font-semibold text-2xl">{data && data[0].name}</header>
      {/* card display */}
      <article>
        <Flashcard setId={params.set} />
      </article>
    </section>
  );
}
