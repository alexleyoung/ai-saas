import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getUser } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const Dashboard = async () => {
  const supabase = createClient();
  const user = await getUser(supabase);

  if (!user) {
    return redirect('/signin');
  }

  return (
    <div className="text-foreground py-6 px-12">
      <header className="py-12">
        <h1 className="text-4xl">AI Flashcards</h1>
      </header>
      {/* display of most recently used sets */}
      <section>
        <header className="py-12">
          <h2 className="text-2xl">Your Sets</h2>
        </header>
        {/* row of cards which represent study sets */}
        <article className="flex gap-4">
          {/* individual cards */}
          <p>set 1</p>
          <p>set 2</p>
          <p>set 3</p>
        </article>
      </section>
    </div>
  );
};

export default Dashboard;
