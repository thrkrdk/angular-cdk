import { FocusMonitor } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatInput } from '@angular/material/input';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-drop-down-search',
  templateUrl: './drop-down-search.component.html',
  styleUrls: ['./drop-down-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropDownSearchComponent implements OnInit {
  isPanelVisble$: Observable<boolean> ;
  @ViewChild(MatInput, { read: ElementRef, static:true })
  private inputEl: ElementRef;

  constructor(private focusMonitor: FocusMonitor) {}
  ngOnInit(): void {
    this.isPanelVisble$ = this.focusMonitor
      .monitor(this.inputEl) // takip edeceği elementi vermek için @viewchild ile ekledi
      .pipe(map((focused) => !!focused)); // monitorün ne döndüğüne bak blur olursa null aksi durum string

  }
}
