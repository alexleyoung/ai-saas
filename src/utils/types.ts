export type FlashcardSet = {
  id: number;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type Flashcard = {
  id: number;
  set_id: number;
  user_id: string;
  question: string;
  answer: string;
  created_at: string;
};

export type aiChat = {
  flashcards: {
    question: string;
    answer: string;
  }[];
};
