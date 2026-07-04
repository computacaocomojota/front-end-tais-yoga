import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bio',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bio.component.html',
  styleUrls: ['./bio.component.scss']
})
export class BioComponent {}