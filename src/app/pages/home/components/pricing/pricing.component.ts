import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PricingPlan, FaqItem } from '../../../../models/pricing.model';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent {
  readonly plans = signal<PricingPlan[]>([
    { 
      name: 'Básico', 
      price: 120.90, 
      desc: 'Para quem busca iniciar a rotina de autocuidado.',
      features: ['1 aula presencial por semana', 'Acesso às aulas gravadas', 'Acompanhamento por WhatsApp'] 
    },
    { 
      name: 'Intermediário', 
      price: 210.90, 
      desc: 'A escolha ideal para evolução e consistência diária.',
      features: ['2 aulas presenciais por semana', 'Acesso total à plataforma online', '1 aula de Meditação guiada', 'Desconto em workshops'] 
    },
    { 
      name: 'Avançado', 
      price: 320.90, 
      desc: 'Experiência completa de imersão e bem-estar integral.',
      features: ['Aulas presenciais ilimitadas', 'Acesso online VIP ilimitado', 'Sessão individual mensal de alinhamento', 'Prioridade em retiros'] 
    }
  ]);

  readonly faqs = signal<FaqItem[]>([
    { 
      question: 'Nunca pratiquei yoga antes. Posso participar mesmo sendo iniciante?',
      answer: 'Com certeza! Nossas aulas são adaptadas com variações para todos os níveis, respeitando os limites e o tempo de cada corpo.'
    },
    { 
      question: 'Não sou nada flexível. O yoga é indicado para mim?',
      answer: 'Sim! A flexibilidade não é pré-requisito, mas sim um dos benefícios que você irá conquistar gradualmente com a prática.'
    },
    { 
      question: 'Quantas vezes por semana é recomendado praticar para sentir os benefícios?',
      answer: 'A partir de 2 vezes por semana você já perceberá melhorias significativas no sono, disposição física e alívio do estresse.'
    },
    { 
      question: 'Preciso levar meu próprio tapete ou usar alguma roupa específica para a aula?',
      answer: 'Recomendamos roupas leves e confortáveis que permitam amplitude de movimento. Disponibilizamos tapetes higienizados no estúdio.'
    }
  ]);

  readonly openFaqIndex = signal<number | null>(null);

  toggleFaq(index: number): void {
    this.openFaqIndex.update(current => current === index ? null : index);
  }

  formatPrice(price: number): string {
    return price.toFixed(2).replace('.', ',');
  }

  isPopularPlan(planName: string): boolean {
    return planName === 'Intermediário';
  }
}