import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function MustBeTrue(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'mustBeTrue',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return typeof value === 'boolean' && typeof relatedValue === 'boolean' && relatedValue === true; // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}