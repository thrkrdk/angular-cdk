import { Overlay, OverlayPositionBuilder } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import { DialogComponent } from './overlay-example/dialog/dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-cdk-lessons';
  constructor(
    private overlay: Overlay,
    private positionBuilder: OverlayPositionBuilder
  ) {}
  openDialog() {
    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.positionBuilder.global().centerHorizontally().centerVertically()
    });
    const dialogPortal = new ComponentPortal(DialogComponent);
    overlayRef.attach(dialogPortal);
    overlayRef.backdropClick().subscribe(()=> overlayRef.detach())
  }
}
