import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ConfigurationService, Configuration } from '../configuration.service';

interface FormField {
  name: string;
  label: string;
  type: string;
  description?: string;
}

@Component({
  templateUrl: 'config.component.html',
})
export class ConfigComponent {
  formFields: FormField[];
  form: FormGroup;
  saving: boolean;
  saved: boolean;
  error: string;

  constructor(private configService: ConfigurationService, formBuilder: FormBuilder) {
    this.formFields = [
      { name: 'maxParticipants', label: 'Maximale Teilnehmeranzahl', type: 'number' },
      { name: 'registrationDeadline', label: 'Anmeldeschluss', type: 'date' },
      { name: 'waiverDeadline', label: 'Frist zur Abgabe der Einverständniserklärung', type: 'date' },
      { name: 'enableTestData', label: 'Ermögliche die Erzeugung von Testdaten in der Anmeldung', type: 'check' },
    ];

    this.form = formBuilder.group({
      maxParticipants: ['', Validators.required],
      registrationDeadline: ['', Validators.required],
      waiverDeadline: ['', Validators.required],
      enableTestData: false,
    });

    this.loadValues();
  }

  private loadValues() {
    this.configService.configuration.first().subscribe(values => this.form.patchValue(values));
  }

  submit() {
    this.error = null;
    this.saved = false;
    this.saving = true;

    const values = this.form.value;
    Promise.all(Object.keys(values).map(key => this.configService.setConfiguration(key, values[key])))
      .then(_ => {
        this.saved = true;
        this.saving = false;
        this.loadValues();
      })
      .catch(err => {
        this.saving = false;
        this.error = err.message;
      });
  }
}