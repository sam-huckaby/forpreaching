import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { share } from 'rxjs/operators';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  // The form itself
  @ViewChild('createIllustrationForm') createForm;

  // Observables
  submit$: any;

  // Form element model
  illustrationForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
    ]),
    body: new FormControl('', [
      Validators.required,
    ]),
  });

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.submit$ = of(true);
  }

  onSubmit(): void {
    // Attempt to create a new illustration (share: https://blog.novanet.no/angular-pitfall-multiple-http-requests-with-rxjs-and-observable-async/)
    this.submit$ = this.http.post('/api/illustrations', this.illustrationForm.value, {responseType: 'json'}).pipe(share());
    this.submit$.subscribe((result) => {
      this.createForm.resetForm();
      // Navigate the user to the detail screen
      this.router.navigate(['/illustration/', result.id]);
    });
  }
}
