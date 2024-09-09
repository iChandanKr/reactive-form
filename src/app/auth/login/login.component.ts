import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, of } from 'rxjs';
function mustContainsQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    return null;
  }
  return { doesNotContainQuestionMark: true };
}

function emailIsUniqueAsync(control: AbstractControl) {
  if (control.value !== 'test@example.com') {
    // can perform http request
    return of(null); //  return observable because of async validator of returns observable thats return null
  }
  return of({ notUniqueEmail: true });
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
      asyncValidators: [emailIsUniqueAsync],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(4),
        mustContainsQuestionMark,
      ],
    }),
  });

  get emailIsInvalid() {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.dirty &&
      this.form.controls.email.invalid
    );
  }
  get passwordIsInvalid() {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.dirty &&
      this.form.controls.password.invalid
    );
  }
  ngOnInit() {
    const savedForm = window.localStorage.getItem('saved-login-form');
    if (savedForm) {
      console.log('inside if');
      const loadedForm = JSON.parse(savedForm);
      console.log(loadedForm);
      this.form.patchValue({
        email: loadedForm.email,
      });
    }
    const subscription = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          window.localStorage.setItem(
            'saved-login-form',
            JSON.stringify({ email: value.email })
          );
        },
      });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onSubmit() {
    console.log(this.form);
    const entredEmail = this.form.value.email;
    const entredPassword = this.form.value.password;
    console.log(entredEmail, entredPassword);
  }
}
