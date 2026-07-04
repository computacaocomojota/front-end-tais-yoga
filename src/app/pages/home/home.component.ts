import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { FeaturesComponent } from './components/features/features.component';
import { BioComponent } from './components/bio/bio.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { ContactComponent } from './components/contact/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    FeaturesComponent,
    BioComponent,
    PricingComponent,
    ContactComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-header></app-header>
    <main>
      <app-hero></app-hero>
      
      <app-features></app-features>
      <app-bio></app-bio>
      <app-pricing></app-pricing>
      <app-contact></app-contact>
    </main>
  `
})
export class HomeComponent {}