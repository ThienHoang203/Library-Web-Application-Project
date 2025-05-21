import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { BORROWING_TRANSACTION } from '../utils/constants';

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
          if (!value || (!(value instanceof Date) && isNaN(Date.parse(value)))) {
            args.constraints.push(`${args.property} không đúng định dạng!`);
            return false;
          }

          const dateValue = new Date(value);
          const currentDate = new Date();
          console.log({ dateValue });
          console.log({ currentDate });
          console.log({ compare: dateValue.getTime() < currentDate.getTime() });

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
