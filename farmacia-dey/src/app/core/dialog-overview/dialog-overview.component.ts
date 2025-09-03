import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-overview',
  templateUrl: './dialog-overview.component.html',
  styleUrl: './dialog-overview.component.css',
})
export class DialogOverviewComponent {
  dialogTitle: string;
  dialogContent: string;
  tipoMensaje = 1;
  sesion: boolean;

  constructor(
    public matDialogRef: MatDialogRef<DialogOverviewComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private router: Router
  ) {
    this.dialogTitle = _data.title;
    this.dialogContent = _data.content;
    this.tipoMensaje = _data.tipoMensaje;
    this.sesion = _data.sesion;
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.matDialogRef.close();
  }

  cerrarDialogoToken() {
    this.matDialogRef.close();
    this.router.navigate(['auth/login']);
  }
}
