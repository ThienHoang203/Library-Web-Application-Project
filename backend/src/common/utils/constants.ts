import { MAX } from 'class-validator';

export const FILE_CONSTANTS = {
  MAX_FILE_EBOOK_SIZE: 60 * 1024 * 1024, // 60MB
  MAX_FILE_COVER_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  UPLOAD_DIR: './uploads',
  EBOOK_FOLDER: './uploads/ebooks',
  COVER_IMAGES_FOLDER: 'uploads/covers',
  COVER_IMAGE_MIME_TYPE: ['image/jpg', 'image/jpeg', 'image/png'],
  COVER_IMAGE_EXT_TYPE: ['.jpg', '.jpeg', '.png'],
  EBOOK_MIME_TYPE: ['application/pdf', 'application/epub+zip'],
  EBOOK_EXT_FILE: ['.pdf', '.epub'],
};

export const VALIDATE = {
  REX_EXP_DATE: /^(\d{4})-(\d{2})-(\d{2})$/,
};

export const BORROWING_TRANSACTION = {
  DUE_DATE: 7 * 24 * 60 * 60 * 1000,
  DEFAULT_BORROW_AT: 24 * 60 * 60 * 1000,
  MAX_BORROWING_BOOK: 2,
  MAX_RENEWAL_DUE_DATE: 1,
  BORROWING_TRANSACTION_FIELDS: [
    'bt.id',
    'bt.userId',
    'bt.bookId',
    'bt.transactionType',
    'bt.createdBy',
    'bt.renewalCount',
    'bt.status',
    'bt.borrowedAt',
    'bt.dueDate',
    'bt.returnedAt',
    'bt.created_at',
    'bt.updated_at',
  ],
  BOOK_FIELDS: [
    'b.id',
    'b.title',
    'b.format',
    'b.author',
    'b.coverImageFilename',
    'b.ebookFilename',
    'b.genre',
    'b.description',
    'b.stock',
    'b.publishedDate',
    'b.version',
    'b.created_at',
    'b.updated_at',
  ],
  ADMIN_BOOK_FIELDS: [
    'b.id',
    'b.title',
    'b.format',
    'b.author',
    'b.coverImageFilename',
    'b.ebookFilename',
    'b.genre',
    'b.description',
    'b.stock',
    'b.publishedDate',
    'b.waitingBorrowCount',
    'b.version',
    'b.created_at',
    'b.updated_at',
  ],
  USER_FIELDS: [
    'u.id',
    'u.username',
    'u.name',
    'u.email',
    'u.phoneNumber',
    'u.role',
    'u.created_at',
    'u.updated_at',
  ],
};
