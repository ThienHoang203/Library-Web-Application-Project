import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { BORROWING_TRANSACTION } from '../utils/constants';
import { parse } from 'path';

export function IsValidBorrowDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidBorrowDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any, args: ValidationArguments) {
          // If value is undefined or null, return false
          if (!value) {
            args.constraints[0] = `${args.property} không đúng định dạng!`;
            return false;
          }
          // If value is not a Date, string, or number, return false
          let dateValue: Date;
          if (value instanceof Date) {
            dateValue = value;
          } else if (typeof value === 'string' || typeof value === 'number') {
            console.log('Hello');

            dateValue = new Date(value);
          } else {
            args.constraints[0] = `${args.property} không đúng định dạng!`;
            return false;
          }

          if (isNaN(dateValue.getTime())) {
            dateValue = new Date(parseInt(value as string, 10));
            if (isNaN(dateValue.getTime())) {
              args.constraints[0] = `${args.property} không đúng định dạng!`;
              return false;
            }
          }
          console.log({ dateValue });

          // Check if the date is in the future
          const currentDate = new Date();
          if (dateValue.getTime() < currentDate.getTime()) {
            args.constraints[0] = `${args.property} không được nhỏ hơn ngày hiện tại!`;
            return false;
          }

          const dueDate = new Date(currentDate.getTime() + BORROWING_TRANSACTION.DUE_DATE);
          console.log({ dueDate });

          if (dateValue.getTime() > dueDate.getTime()) {
            args.constraints[0] = `${args.property} tối đa 7 ngày tình từ thời điểm tạo giao dịch!`;
            return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return args.constraints[0];
        },
      },
    });
  };
}
