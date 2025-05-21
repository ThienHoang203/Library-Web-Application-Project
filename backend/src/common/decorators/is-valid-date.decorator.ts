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

          const year = parseInt(match[1], 10);
          const month = parseInt(match[2], 10);
          const date = parseInt(match[3], 10);
          const lastDate = new Date(year, month, 0).getDate();

          const today = new Date();

          if (year > today.getFullYear()) {
            args.constraints[0] = 'Năm không được lớn hơn năm hiện tại';
            return false;
          }

          if (month < 1 || month > 12) {
            args.constraints[0] = 'Tháng phải từ 1 đến 12';
            return false;
          }

          if (date < 1 || date > lastDate) {
            args.constraints[0] = `Ngày trong tháng ${month} phải từ 1 đến ${lastDate}`;
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
