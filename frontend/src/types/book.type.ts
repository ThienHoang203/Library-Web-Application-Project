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
    PHYS = "bản in",
    DIG = "bản điện tử"
}

export enum BookSortType {
    ID = "id",
    TITLE = "title",
    FORMAT = "format",
    AUTHOR = "author",
    GERNE = "gerne",
    STOCK = "stock",
    WAITING_BORROW_COUNT = "waitingBorrowCount",
    PUBLISHED_DATE = "publishedDate",
    VERSION = "version",
    CREATED_AT = "created_at",
    UPDATED_AT = "updated_at"
}

export type Book = {
    id: number;
    title: string;
    format: BookFormat;
    author: string;
    coverImageFilename: string;
    contentFilename: string;
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
    version: "Version"
};
