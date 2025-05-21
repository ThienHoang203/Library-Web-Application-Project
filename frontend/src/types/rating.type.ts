export type RatingType = {
    id: number;
    userId: number;
    bookId: number;
    rating: number;
    comment: string;
    created_at: Date;
    updated_at: Date;
};
