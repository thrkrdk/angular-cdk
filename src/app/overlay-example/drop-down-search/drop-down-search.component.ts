import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Observable, merge, iif, EMPTY } from 'rxjs';
import { map, filter, startWith, switchMap, delay } from 'rxjs/operators';
import { FocusMonitor } from '@angular/cdk/a11y';
import { MatInput } from '@angular/material/input';
import {
  CdkConnectedOverlay,
  ConnectedPosition,
  OverlayRef,
  ScrollStrategy,
  ScrollStrategyOptions,
} from '@angular/cdk/overlay';
import { FormControl } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

export interface State {
  flag: string;
  name: string;
  population: string;
}
@Component({
  selector: 'app-drop-down-search',
  templateUrl: './drop-down-search.component.html',
  styleUrls: ['./drop-down-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropDownSearchComponent implements OnInit {
  showPanel$: Observable<boolean>;

  states: State[] = [
    {
      name: 'Ankara',
      population: '5.663M',
      flag: 'https://upload.wikimedia.org/wikipedia/tr/a/a1/Ankara_Büyükşehir_Belediyesi_logosu.png',
    },
    {
      name: 'İstanbul',
      population: '15.46M',
      flag: 'https://upload.wikimedia.org/wikipedia/tr/2/24/Ibb_amblem.png',
    },
    {
      name: 'Adana',
      population: '1.769M',
      flag: 'https://upload.wikimedia.org/wikipedia/tr/f/ff/Adana_Büyükşehir_Belediyesi_logo.png',
    },
    {
      name: 'İzmir',
      population: '4.367K',
      flag: 'https://upload.wikimedia.org/wikipedia/tr/d/df/İzmir_Büyükşehir_Belediyespor_logo.png',
    },
  ];

  stateCtrl = new FormControl();
  filteredStates$: Observable<State[]>;
  isCaseSensitive: boolean = false;

  position: ConnectedPosition[] = [
    {
      originX: 'center',
      originY: 'bottom',
      overlayX: 'center',
      overlayY: 'top',
      offsetY: -21,
    },
    {
      originX: 'center',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'bottom',
      panelClass: 'no-enough-space-at-bottom',
    },
  ];

  @ViewChild(MatInput, { read: ElementRef, static: true })
  private inputEl: ElementRef;

  @ViewChild(CdkConnectedOverlay, { static: true })
  private connectedOverlay: CdkConnectedOverlay;

  private isPanelVisible$: Observable<boolean>;
  private isPanelHidden$: Observable<boolean>;

  scrollStagety: ScrollStrategy; // bu git template tanımla

  constructor(
    private focusMonitor: FocusMonitor,
    private scrollStrageties: ScrollStrategyOptions
  ) {}

  ngOnInit(): void {
    // this.scrollStagety = this.scrollStrageties.block(); // sayfadaki scroll işlemini bloklar
    //   this.scrollStagety = this.scrollStrageties.close(); // scroll yapılınca overlay kapanır

    /* this.scrollStagety = this.scrollStrageties.close({
        threshold: 100, //100 px'lik bir scrolldan sonra disable olur
      }); // scroll yapılınca overlay kapanır
    */
    //  this.scrollStagety = this.scrollStrageties.noop(); // panel sabit kalır scroll yapılır
    this.scrollStagety = new ConfirmScrollStragety(this.inputEl); // varsayılan değerdir. ilk başta nasıl davranıyorsa öyle davranır

    this.isPanelHidden$ = merge(
      this.connectedOverlay.detach,
      this.connectedOverlay.backdropClick
    ).pipe(map(() => false));

    this.isPanelVisible$ = this.focusMonitor.monitor(this.inputEl).pipe(
      filter((focused) => !!focused),
      map(() => true)
    );

    this.showPanel$ = merge(this.isPanelHidden$, this.isPanelVisible$);

    this.filteredStates$ = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map((state) => (state ? this._filterStates(state) : this.states.slice()))
    );
  }

  setCaseSensitive({ checked }: MatSlideToggleChange) {
    this.isCaseSensitive = checked;
  }

  private _filterStates(value: string): State[] {
    const filterValue = this.caseCheck(value);

    return this.states.filter(
      (state) => this.caseCheck(state.name).indexOf(filterValue) === 0
    );
  }

  private caseCheck(value: string) {
    return this.isCaseSensitive ? value : value.toLowerCase();
  }
}

class ConfirmScrollStragety implements ScrollStrategy {
  _overlay: OverlayRef;
  constructor(private inputRef: ElementRef) {}

  attach(overlayRef: OverlayRef) {
    this._overlay = overlayRef;
  }

  enable() {
    document.addEventListener('scroll', this.scrollListener);
  }
  disable() {
    document.removeEventListener('scroll', this.scrollListener);
  }
  private scrollListener = () => {
    if (confirm('The Overlay Will Be Closed. Are You OK Wiht That? ')) {
      this._overlay.detach();
      this.inputRef.nativeElement.blur();
      return;
    }
    this._overlay.updatePosition();
  };
}
