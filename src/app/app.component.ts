import { Overlay, OverlayPositionBuilder } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { DialogComponent } from './overlay-example/dialog/dialog.component';
import { Platform } from '@angular/cdk/platform';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular-cdk-lessons';
  isWideScreen$: Observable<boolean>

  constructor(
    private overlay: Overlay,
    private positionBuilder: OverlayPositionBuilder,
    public platform: Platform,
    private breakPointObservers: BreakpointObserver
  ) {}

  ngOnInit(): void {
    if (this.breakPointObservers.isMatched('(max-width: 600px)'))  {
      console.log ('genişlik çok düşük')
    } // 1- devam etmenden çalıştır ve logu göster

   //2-   this.breakPointObservers.observe('(max-width: 600px)').subscribe(console.log); // sonucu göster

   // 3-  this.breakPointObservers.observe(['(max-width: 600px)', '(max-width: 1000px)']).subscribe(console.log); // sonucu göster

   // this.isWideScreen$ = this.breakPointObservers.observe(['(min-width: 600px)']).pipe(map(({matches}) => matches));  // isWideScreen$ html ekle ve sonucu göster


   // ön tanımlı ekran genişliklerini kullanabiliriz
   this.isWideScreen$ = this.breakPointObservers.observe(Breakpoints.HandsetLandscape).pipe(map(({matches}) => matches)); 
   // https://github.com/angular/components/blob/main/src/cdk/layout/breakpoints.ts
  }
  openDialog() {
    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.positionBuilder
        .global()
        .centerHorizontally()
        .centerVertically(),
    });
    const dialogPortal = new ComponentPortal(DialogComponent);
    overlayRef.attach(dialogPortal);
    overlayRef.backdropClick().subscribe(() => overlayRef.detach());
  }
}
