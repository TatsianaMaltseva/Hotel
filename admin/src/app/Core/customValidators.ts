import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export function matchValidator(key1: string, key2: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const value1 = group.get(key1)?.value as string;  
    const value2 = group.get(key2)?.value as string;
    return value1 === value2 ? null : { notSame: true };
    };
}

export class CustomValidators {
    public static match(key1: string, key2: string): ValidatorFn {
        return matchValidator(key1, key2);
    }
}