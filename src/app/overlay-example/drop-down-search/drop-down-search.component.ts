import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Observable, merge, iif, EMPTY } from 'rxjs';
import {
  map,
  filter,
  startWith,
  switchMap,
  delay,
} from 'rxjs/operators';
import { FocusMonitor } from '@angular/cdk/a11y';
import { MatInput } from '@angular/material/input';
import {
  CdkConnectedOverlay,
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
      flag:
        'https://upload.wikimedia.org/wikipedia/tr/a/a1/Ankara_Büyükşehir_Belediyesi_logosu.png',
    },
    {
      name: 'İstanbul',
      population: '15.46M', 
      flag:
        'https://upload.wikimedia.org/wikipedia/tr/2/24/Ibb_amblem.png',
    },
    {
      name: 'Adana',
      population: '1.769M',
      flag:
        'https://upload.wikimedia.org/wikipedia/tr/f/ff/Adana_Büyükşehir_Belediyesi_logo.png',
    },
    {
      name: 'İzmir',
      population: '4.367K',
      flag:
        'https://upload.wikimedia.org/wikipedia/tr/d/df/İzmir_Büyükşehir_Belediyespor_logo.png',
    },
  ];

  
  stateCtrl = new FormControl();
  filteredStates$: Observable<State[]>;
  isCaseSensitive: boolean = false; 

  @ViewChild(MatInput, { read: ElementRef, static: true })
  private inputEl: ElementRef;

  @ViewChild(CdkConnectedOverlay, { static: true })
  private connectedOverlay: CdkConnectedOverlay;

  private isPanelVisible$: Observable<boolean>;
  private isPanelHidden$: Observable<boolean>;

  constructor(
    private focusMonitor: FocusMonitor
  ) {}

  ngOnInit(): void { 
    this.isPanelHidden$ = merge(
      this.connectedOverlay.detach,
      this.connectedOverlay.backdropClick
    ).pipe(map(() => false));

    this.isPanelVisible$ = this.focusMonitor.monitor(this.inputEl).pipe(
      filter((focused) => !!focused),
      map(()=>true)
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

