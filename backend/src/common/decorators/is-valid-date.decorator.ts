import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { VALIDATE } from '../utils/constants';

export function IsValidDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            args.constraints[0] = 'Ngày không phải chuỗi';
            return false;
          }

          const match = value.match(VALIDATE.REX_EXP_DATE);
          if (!match) {
            args.constraints[0] = 'Ngày phải có định dạng YYYY-MM-DD';
            return false;
          }

          const date = new Date(value);

          if (isNaN(date.getTime())) {
            args.constraints[0] = 'Ngày không đúng!';
            return false;
          }

          const today = new Date();

          today.setHours(0, 0, 0, 0);

          if (date.getTime() > today.getTime()) {
            args.constraints[0] = 'Ngày không được vượt qua ngày hiện tại!';
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
