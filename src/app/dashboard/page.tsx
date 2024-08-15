import { getUser } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

import StudySets from '@/components/dashboard/StudySets';

export default async function Dashboard() {
  const supabase = createClient();
  const user = await getUser(supabase);

  if (!user) {
    return redirect('/signin');
  }

  return (
    <div className="text-foreground py-6 px-12 flex flex-col gap-12">
      <header>
        <h1 className="text-4xl">AI Flashcards</h1>
      </header>
      <StudySets userId={user.id} />
    </div>
  );
}
