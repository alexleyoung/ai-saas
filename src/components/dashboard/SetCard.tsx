import Link from 'next/link';

type SetCardProps = { name: string };

const SetCard = ({ name }: SetCardProps) => {
  return (
    <Link href="/dashboard">
      <div className="size-64 border rounded-md flex flex-col hover:bg-accent transition-colors items-center justify-center">
        <h1 className="font-semibold text-3xl">{name}</h1>
      </div>
    </Link>
  );
};

export default SetCard;
