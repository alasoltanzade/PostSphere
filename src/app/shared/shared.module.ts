import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent } from './alert/alert.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { PlaceHolderDirective } from './placeholder/placeholder.directive';
import { DropdownDirective } from './dropdown.directive';
import { ReactiveFormsModule } from '@angular/forms';

import { LoggingSerive } from '../logging-service';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceHolderDirective,
    DropdownDirective,
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceHolderDirective,
    DropdownDirective,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
  ],
  providers: [LoggingSerive],
})
export class SharedModule {}
