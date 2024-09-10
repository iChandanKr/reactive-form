import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

function comparePasswords(controlName1:string,controlName2:string) {


  return (control: AbstractControl)=>{

    const val1 = control.get(controlName1)?.value;
    const val2 = control.get(controlName2)?.value;
    // console.log(val1);
    // console.log(val2)
    if (val1 === val2) {
      return null;
    }
    return { valuesNotEqual: true };
  }
}
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    passwords: new FormGroup(
      {
        password: new FormControl('', {
          validators: [Validators.required, Validators.minLength(6)],
        }),
            confirmPassword: new FormControl('', {
          validators: [Validators.required],
        }),
      },
      {
        validators: [comparePasswords('password','confirmPassword')],
      }
    ),
    firstName: new FormControl('', {
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      validators: [Validators.required],
    }),

    address: new FormGroup({
      street: new FormControl('', {
        validators: [Validators.required],
      }),
      number: new FormControl('', {
        validators: [Validators.required],
      }),
      postalCode: new FormControl('', {
        validators: [
          Validators.required,
          Validators.maxLength(6),
          Validators.minLength(6),
        ],
      }),
      city: new FormControl('', {
        validators: [Validators.required],
      }),
    }),
    source: new FormArray([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
    ]),
    isAgree: new FormControl(false, {
      validators: [Validators.required],
    }),
    role: new FormControl<
      'student' | 'teacher' | 'employee' | 'founder' | 'others'
    >('student', {
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    if (this.form.invalid) {
      console.log('INVALID FORM ');
      return;
    }
    console.log(this.form);
  }
  onReset() {
    this.form.reset();
  }
}
