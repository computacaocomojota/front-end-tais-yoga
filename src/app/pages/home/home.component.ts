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
      
      @defer (on viewport) {
        <app-features></app-features>
      } @placeholder {
        <div style="min-height: 480px; display: flex; justify-content: center; align-items: center;"></div>
      }

      @defer (on viewport) {
        <app-bio></app-bio>
      } @placeholder {
        <div style="min-height: 480px; display: flex; justify-content: center; align-items: center;"></div>
      }

      @defer (on viewport) {
        <app-pricing></app-pricing>
      } @placeholder {
        <div style="min-height: 600px; display: flex; justify-content: center; align-items: center;"></div>
      }

      @defer (on viewport) {
        <app-contact></app-contact>
      } @placeholder {
        <div style="min-height: 500px; display: flex; justify-content: center; align-items: center;"></div>
      }
    </main>
  `
})
export class HomeComponent {}