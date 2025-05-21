import { InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';
import path, { join, parse } from 'path';
import { TransactionTypeTime } from 'src/modules/borrowing-transaction/dto/admin-filter-transaction.dto';

export function generateRandomCode(length: number): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += crypto.randomInt(0, 10);
  }
  return code;
}

export function createFolderIfAbsent(folderPath: string) {
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
}

export function createFilename(file: Express.Multer.File): string {
  const parsedFile: path.ParsedPath = parse(file.originalname);

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

  return `${parsedFile.name}-${uniqueSuffix}${parsedFile.ext}`;
}

export function createFilenameAndsaveFile(file: Express.Multer.File, folderPath: string): string {
  const filename = createFilename(file);

  const filePath = join(process.cwd(), folderPath, filename);

  fs.writeFileSync(filePath, file.buffer);

  return filename;
}

export function replaceFile(
  file: Express.Multer.File,
  folderPath: string,
  oldFileName?: string,
): string {
  //would remove old file if it existed
  if (oldFileName && oldFileName !== '') {
    const result = removeFile(oldFileName, folderPath);

    if (!result) throw new InternalServerErrorException(`Không thể xóa file: ${oldFileName}`);
  }

  const filename = createFilename(file);

  saveFile(file, folderPath, filename);

  return filename;
}

export async function removeFile(filename: string, folderPath: string): Promise<boolean> {
  const filePath = join(process.cwd(), folderPath, filename);
  if (!fs.existsSync(filePath)) return false;

  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    return false;
  }

  return true;
}

export function saveFile(file: Express.Multer.File, folderPath: string, filename: string): void {
  const filePath = join(process.cwd(), folderPath, filename);

  fs.writeFileSync(filePath, file.buffer);
}

export function buildDateRange(
  type: TransactionTypeTime,
  value: string,
): { start: Date; end: Date } {
  let start: Date, end: Date;
  if (type === TransactionTypeTime.DATE) {
    const d = new Date(value); // “YYYY-MM-DD”
    start = new Date(d);
    start.setHours(0, 0, 0, 0);
    end = new Date(d);
    end.setHours(23, 59, 59, 999);
  } else if (type === TransactionTypeTime.MONTH) {
    const [y, m] = value.split('-').map(Number); // [YYYY, MM]
    start = new Date(y, m - 1, 1, 0, 0, 0, 0);
    end = new Date(y, m, 0, 23, 59, 59, 999);
  } else {
    // year
    const y = Number(value); // “YYYY”
    start = new Date(y, 0, 1, 0, 0, 0, 0);
    end = new Date(y, 12, 0, 23, 59, 59, 999);
  }
  return { start, end };
}
