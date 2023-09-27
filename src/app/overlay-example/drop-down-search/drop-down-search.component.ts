import { FocusMonitor } from '@angular/cdk/a11y';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatInput } from '@angular/material/input';
import { Observable, filter, map, merge } from 'rxjs';

@Component({
  selector: 'app-drop-down-search',
  templateUrl: './drop-down-search.component.html',
  styleUrls: ['./drop-down-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropDownSearchComponent implements OnInit {
  showPanel$: Observable<boolean>;
  private isPanelVisible$: Observable<boolean>;
  private isPanelHidden$: Observable<boolean>;
  @ViewChild(MatInput, { read: ElementRef, static: true })
  private inputEl: ElementRef;

  @ViewChild(CdkConnectedOverlay, { static: true })
  private connectedOverlay: CdkConnectedOverlay;

  constructor(private focusMonitor: FocusMonitor) {}
  ngOnInit(): void {
    this.isPanelHidden$ = this.connectedOverlay.backdropClick.pipe(
      map(() => false)
    ); // brackdrop tıklandıkça false dönecek şekilde ayarlıyoruz

    this.isPanelVisible$ = this.focusMonitor.monitor(this.inputEl).pipe(
      filter((focused) => !!focused),
      map(() => true)
    ); // map ile focus olduğunda hep true döncek şekilde sabitledik
    // ikinci stream yapmadan overlay n back drop u olması için hmtl de property ekle

    this.showPanel$ = merge(this.isPanelHidden$, this.isPanelVisible$);
  }
}
