export type RatingType = {
  id: number;
  userId: number;
  bookId: number;
  rating: number;
  user:[];
  comment: string;
  created_at: Date;
  updated_at: Date;
};
export type CreateRatingType = {
  rating: number;
  bookId: number;
  comment: string;
};
