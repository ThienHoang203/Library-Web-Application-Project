import { Book } from "./book.type";

export type BookShelf = {
  id: number;
  userId: number;
  status: string;
  book: Book;
};
