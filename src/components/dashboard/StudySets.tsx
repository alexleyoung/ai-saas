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

type StudySetsProps = { userId: string };

const StudySets = ({ userId }: StudySetsProps) => {
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
            <NewSetForm userId={userId} className="mt-4" />
          </DialogContent>
        </Dialog>
      </header>
      {/* row of cards which represent study sets */}
      <article className="flex gap-4">
        {/* individual cards */}
        {/* <SetCard name="hello" />
        <SetCard name="hello2" />
        <SetCard name="hello3" /> */}
      </article>
    </section>
  );
};

export default StudySets;
