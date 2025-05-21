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
};
