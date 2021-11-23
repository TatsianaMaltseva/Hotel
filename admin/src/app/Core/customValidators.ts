import { AbstractControl, FormControl, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

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

export class ConfirmValidParentMatcher implements ErrorStateMatcher {
    public constructor(
        private readonly errorKey: string
    ) {
    }

    public isErrorState(
        control: FormControl | null, 
        form: FormGroupDirective | NgForm | null): boolean {
            return (control?.touched && control.parent?.hasError(this.errorKey)) === true;
    }
}