import { Database as db } from '@/utils/types_db';
import {
  FlashcardSet as fs,
  Flashcard as f,
  aiChat as ai
} from '@/utils/types';

declare global {
  type Database = db;
  type FlashcardSet = fs;
  type Flashcard = f;
  type aiChat = ai;
}
