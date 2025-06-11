import { Book } from "./book.type";
import { User } from "./user.type";

export type Borrow = {
  bookId: number;
  borrowedAt: Date;
};

export type BorrowType = {
  id: number;
  created_at: string;
  updated_at: string;
  borrowedAt: string;
  dueDate: string;
  status: string;
  user: User;
  book: Book;
};
