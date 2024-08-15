import { Button } from '@/components/ui/button';
import SetCard from './SetCard';

const StudySets = () => {
  return (
    <section className="flex flex-col gap-12">
      <header className="flex flex-col gap-4">
        <h2 className="text-2xl">Your Sets</h2>
        <Button className="max-w-fit">Create Set</Button>
      </header>
      {/* row of cards which represent study sets */}
      <article className="flex gap-4">
        {/* individual cards */}
        <SetCard name="hello" />
        <SetCard name="hello2" />
        <SetCard name="hello3" />
      </article>
    </section>
  );
};

export default StudySets;
