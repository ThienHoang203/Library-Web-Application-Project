import { HeaderMap } from "./common.type";

export enum BookGerne {
    MYSTERY = "trinh thám",
    ROMANCE = "lãng mạn",
    FANTASY = "kỳ ảo",
    SCIENCE_FICTION = "khoa học viễn tưởng",
    HORROR = "kinh dị",
    THRILLER = "giật gân / hồi hộp"
}

export enum BookFormat {
    PHYSIC = "bản in",
    DIGITAL = "bản điện tử"
}

export enum BookSortType {
    TITLE = "title",
    AUTHOR = "author",
    GENRE = "genre",
    PUBLISHED_DATE = "publishedDate",
    VERSION = "version",
    CREATED_AT = "created_at"
}

type User = {
    id: number;
    name: string;
};
type Rating = {
    id: number;
    comment: string;
    created_at: string;
    updated_at: string;
    rating: number;
    bookId: number;
    userId: number;
    user: User;
};
export type Book = {
    id: number;
    title: string;
    format: BookFormat;
    avgRating: string;
    ratingCount: string;
    author: string;
    coverImageFilename?: string;
    ratings: Rating[];
    ebookFilename: string;
    genre: BookGerne;
    description: string;
    stock: number;
    waitingBorrowCount: number;
    publishedDate: Date;
    version: number;
};

export type CreateBookType = {
    author: string;
    title: string;
    genre?: BookGerne;
    description?: string;
    format: BookFormat;
    stock?: number;
    publishedDate?: Date;
    version?: number;
    ebookFile?: FileList;
    coverImageFile?: FileList;
};

export type UpdateBookType = Partial<Omit<CreateBookType, "format">>;
type bookHeaders = Omit<
    Book,
    "coverImageFilename" | "contentFilename" | "description" | "stock" | "waitingBorrowCount"
>;

export const BOOK_HEADERS: HeaderMap<bookHeaders> = {
    id: "ID",
    title: "Title",
    format: "Format",
    author: "Author",
    genre: "Genre",
    publishedDate: "Published Date",
    version: "Version",
    ebookFilename: "Ebook Filename",
    avgRating: "",
    ratingCount: "",
    ratings: ""
};
