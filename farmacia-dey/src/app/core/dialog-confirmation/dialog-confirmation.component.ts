import { Component, EventEmitter, HostListener, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirmation',
  templateUrl: './dialog-confirmation.component.html',
  styleUrl: './dialog-confirmation.component.css'
})
export class DialogConfirmationComponent {
  isButtonVisible: boolean = true;

  dialogContent = '';

  onSi = new EventEmitter();
  onNo = new EventEmitter();

  loading = false;
  constructor(
    public matDialogRef: MatDialogRef<DialogConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any
  ) {
    this.dialogContent = _data.content;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "Escape" || event.key === "Esc") { 
      this.onClickNo();
    }
  }

  onClickNo(): void {
    this.onNo.emit(false);
    this.matDialogRef.close();
  }

  onClickSi(): void {
    this.loading = true;
    this.onSi.emit(true);
    this.matDialogRef.close();
  }
}