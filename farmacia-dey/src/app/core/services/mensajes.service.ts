import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { DialogLoadingComponent } from '../dialog-loading/dialog-loading.component';
import { DialogOverviewComponent } from '../dialog-overview/dialog-overview.component';
import { enumTipoMensaje } from '../enums/enum-tipo-mensaje.enum';

@Injectable({
    providedIn: 'root',
})
export class MensajesService {
    dialogLoading!: MatDialogRef<any>;

    constructor(
        public dialog: MatDialog,
    ) {}

    showMessageSuccess(
        content: string = 'Se ha ejecutado la acción correctamente'
    ): void {
        this.closeLoading();
        const dialogRef = this.dialog.open(DialogOverviewComponent, {
            panelClass: 'dialog-general',
            disableClose: true,
            data: {
                title: 'INFORMACIÓN',
                content: content,
                tipoMensaje: enumTipoMensaje.INFORMACION,
            },
        });
    }

    showMessageWarning(content: string): void {
        this.closeLoading();
        const dialogRef = this.dialog.open(DialogOverviewComponent, {
            panelClass: 'dialog-general',
            disableClose: true,
            data: {
                title: 'ADVERTENCIA',
                content: content,
                tipoMensaje: enumTipoMensaje.ADVERTENCIA,
            },
        });
    }

    showMessageError(content: string): void {
        this.closeLoading();
        const dialogRef = this.dialog.open(DialogOverviewComponent, {
            panelClass: 'dialog-general',
            disableClose: true,
            data: {
                title: 'ERROR',
                content: content,
                tipoMensaje: enumTipoMensaje.ERROR,
            },
        });
    }

    showMessageErrorObservable(error: any): void {
        this.closeLoading();
        let tipoMensaje = enumTipoMensaje.ADVERTENCIA;

        if(error?.error?.estado == -3){
            tipoMensaje = enumTipoMensaje.TOKEN;
        }


        const dialogRef = this.dialog.open(DialogOverviewComponent, {
            panelClass: 'dialog-general',
            disableClose: true,
            data: {
                title: 'ERROR',
                content: error.error?.mensaje?? 'Ocurrió un error interno',
                tipoMensaje: tipoMensaje,
            },
        });
    }

    showLoading(): void {
        this.dialogLoading = this.dialog.open(DialogLoadingComponent, {
            panelClass: 'dialog-general',
            disableClose: true,
            width: '200px',
        });
    }

    closeLoading(): void {
        if(this.dialogLoading){
            this.dialogLoading.close();
        }
    }

    crearConfirmacion(contentConfirmation: any): MatDialogRef<DialogConfirmationComponent>{
        return this.dialog.open(DialogConfirmationComponent, {
            panelClass: 'confirmation-general',
            disableClose: true,
            data: { content: contentConfirmation },
        });
    }
}
