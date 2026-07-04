import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Testimonial } from '../../../../models/testimonial.model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  readonly testimonials = signal<Testimonial[]>([
    { 
      name: 'Márcia Silva', 
      photo: 'https://i.pravatar.cc/150?u=marcia', 
      text: 'Depois que comecei a praticar com a Taíse, minhas crises de ansiedade diminuíram drasticamente. A abordagem acolhedora faz toda a diferença.' 
    },
    { 
      name: 'Ingrid Fonseca', 
      photo: 'https://i.pravatar.cc/150?u=ingrid', 
      text: 'A Taíse é uma profissional maravilhosa! Suas aulas me trouxeram muita consciência corporal e ajudaram a aliviar minhas dores crônicas nas costas.' 
    },
    { 
      name: 'Manoela Dias', 
      photo: 'https://i.pravatar.cc/150?u=manoela', 
      text: 'O momento da aula se tornou a melhor parte da minha semana. Excelente didática e uma energia muito boa que ajuda a acalmar a mente e focar no presente.' 
    }
  ]);

  readonly contactForm = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl<string>('', { nonNullable: true }),
    message: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
  });

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Mensagem enviada com sucesso:', this.contactForm.value);
      alert('Sua mensagem foi enviada com sucesso! Em breve entraremos em contato.');
      this.contactForm.reset();
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}