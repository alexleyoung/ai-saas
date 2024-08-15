import Link from 'next/link';

type SetCardProps = { name: string; id: number };

const SetCard = ({ name, id }: SetCardProps) => {
  return (
    <Link href={`/dashboard/${id}`}>
      <div className="size-64 border rounded-md flex flex-col hover:bg-accent transition-colors items-center justify-center">
        <h1 className="font-semibold text-3xl">{name}</h1>
      </div>
    </Link>
  );
};

export default SetCard;
