import { Component } from '@angular/core';
import { EmailValidator, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Users1Service } from './users1.service';

@Component({
  selector: 'app-porfile',
  standalone: true,
  imports: [ReactiveFormsModule,
    FormsModule],
  templateUrl: './porfile.component.html',
  styleUrl: './porfile.component.css'
})
export class PorfileComponent {
porfileForm!: FormGroup;
  loading = false;
  msg: string = '';

  constructor(
    private fb: FormBuilder,
    private users1Service: Users1Service
  ) {}

  ngOnInit(): void {
    this.porfileForm = this.fb.group({
      user_name: ['', [Validators.required, Validators.minLength(3)]],
      email: [{ value: '', disabled: true }, [Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });

    // Cargar info del usuario logeado
    this.users1Service.getProfile().subscribe(user => {
      this.porfileForm.patchValue({
        user_name: user.user_name,
        phone: user.phone,
        email: user.email
      });
    });
  }

  saveChanges() {
    if (this.porfileForm.invalid) return;

    this.loading = true;

    this.users1Service.updateProfile(this.porfileForm.getRawValue())
      .subscribe({
        next: () => {
          this.msg = "Información actualizada correctamente";
          this.loading = false;
        },
        error: () => {
          this.msg = "Error al actualizar";
          this.loading = false;
        }
      });
  }
}
