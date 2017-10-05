import 'rxjs/add/operator/first';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';

import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { RegistrationService } from '../registration.service';
import { ConfigurationService } from '../configuration.service';
import { CustomValidators } from '../validators';
import { Registration, ShirtSize, Price, PriceElement, RegistrationCode } from '../model';
import { createTestData } from './testdata';


@Component({
  templateUrl: 'registration.component.html'
})
export class RegistrationComponent {
  private subscription: Subscription;
  error: string;
  form: FormGroup;
  submitting: boolean;
  shirtSizes = ShirtSize.values;
  price: Price;
  registrationStatus: string;
  registrationDeadline: string;
  registrationCode: RegistrationCode;
  enableTestData: boolean;

  constructor(
    private router: Router,
    route: ActivatedRoute,
    private registrationService: RegistrationService,
    config: ConfigurationService,
    formBuilder: FormBuilder
  ) {
    const registrationCodeObs = route.paramMap.map(params => params.get('code'))
      .mergeMap(code => code ? registrationService.getRegistrationCode(code) : Observable.of(null));
    this.subscription = registrationCodeObs.subscribe(code => this.registrationCode = code);

    this.subscription.add(
      Observable.combineLatest(registrationService.registrationStatus, registrationCodeObs)
      .map(results => {
        const [ status, code ] = results;
        if (status !== 'ok' && code && !code.used) return 'code';
        return status;
      })
      .subscribe(status => this.registrationStatus = status)
    );

    this.subscription.add(
      registrationService.registrationDeadline.subscribe(deadline => this.registrationDeadline)
    );

    this.form = formBuilder.group({
      child: formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        gender: ['', [Validators.required, CustomValidators.oneOf('m', 'w')]],
        dateOfBirth: ['', Validators.required],
        shirtSize: ['', [Validators.required, CustomValidators.oneOf(...ShirtSize.values.map(s => s.id))]],
        vegetarian: false,
        miscellaneous: '',
        nextChild: false,
      }),
      parent: formBuilder.group({
        phone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        street: ['', Validators.required],
        zip: ['', Validators.required],
        city: ['', Validators.required],
      }),
      emergencyContact: formBuilder.group({
        name: ['', Validators.required],
        phone: ['', Validators.required],
      }),
    });

    this.subscription.add(
      config.configuration
      .map(c => c.enableTestData)
      .subscribe(enable => this.enableTestData = enable)
    );

    const updatePrice = values => this.price = new Registration(values).price;
    this.form.valueChanges.forEach(updatePrice);
    updatePrice(this.form.value);
  }

  createTestData() {
    if (this.enableTestData) {
      this.form.patchValue(createTestData());
    }
  }

  submit() {
    this.error = null;
    this.submitting = true;
    const reg = new Registration(this.form.value);
    const code = this.registrationCode ? this.registrationCode.id : null
    this.registrationService.submitRegistration(reg, code).first().subscribe(
      reg => this.router.navigate(['/anmeldung', reg.id]),
      err => { this.submitting = false; this.error = err.message; }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
