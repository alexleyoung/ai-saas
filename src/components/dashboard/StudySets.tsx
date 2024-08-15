const StudySets = () => {
  return (
    <section>
      <header>
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
  );
};

export default StudySets;
