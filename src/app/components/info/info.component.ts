import { Component, Inject, OnInit } from '@angular/core';
import {MatSnackBarRef, MAT_SNACK_BAR_DATA} from '@angular/material';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
              private snackBarRef: MatSnackBarRef<InfoComponent>) {}

  public onClose() {
    this.snackBarRef.dismiss();
  }

  ngOnInit() {
  }
}
