import {
  FormGroup,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

export class FormValidationUtils {
  public static maxLength: number = 20;
  public static minLength: number = 20;

  constructor(private frm: FormGroup) {}

  public static noEspaciosEnBlanco(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }
      const pattern = '^([ ]+)|([ ]+)$'
      const regex = new RegExp(pattern);
      if(regex.test(value)){
        return {
          noEspaciosEnBlanco: {
            error: true,
            messageError: 'No se aceptan espacios al inicio o final',
          },
        };
      }

      return value.toString().trim().length === 0
        ? {
            noEspaciosEnBlanco: {
              error: true,
              messageError: 'No se aceptan espacios en blanco.',
            },
          }
        : null;
    };
  }

  public static isAnio(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const anioMin = 2000;
      const anioMax = 2050;

      if (!value || value < anioMin || value > anioMax) {
        return {
          isAnio: {
            error: true,
            messageError: `El año debe estar entre ${anioMin} y ${anioMax}`,
          },
        };
      }

      const pattern = '^[0-9]{4}$';
      const regex = new RegExp(pattern);
      return regex.test(value)
        ? null
        : {
            soloDigitos: {
              error: true,
              messageError: 'El año no es válido',
            },
          };
    };
  }

  public static soloDigitos(minLength: number, maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const pattern = '^[0-9]{' + minLength + ',' + maxLength + '}$';
      const regex = new RegExp(pattern);
      return regex.test(value)
        ? null
        : {
            soloDigitos: {
              error: true,
              messageError:
                minLength === maxLength
                  ? `El campo solo acepta ${minLength} dígitos.`
                  : `El campo acepta entre [${minLength} - ${maxLength}] dígitos.`,
            },
          };
    };
  }

  public static isEntero(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const pattern = '^[0-9]+$';
      const regex = new RegExp(pattern);
      if (regex.test(value)) {
        return null;
      }

      return {
        isEntero: {
          error: true,
          messageError: `El valor '${value}' no es entero.`,
        },
      };
    };
  }

  public static isNumerico(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const pattern = '^[0-9]+((.)([0-9]{1,2})){0,1}$';
      const regex = new RegExp(pattern);
      if (regex.test(value)) {
        return null;
      }

      return {
        isNumerico: {
          error: true,
          messageError: 'El valor ingresado no es válido. (acepta 2 decimales)',
        },
      };
    };
  }

  public static isFormatFile(file: any, formatos: string[] = []): any {
    const formato = file.type.split('/').pop().toLowerCase();
    if (!formatos.includes(formato)) {
      return {
        error: true,
        message: `El formato no es válido. Formatos permitidos ( ${formatos.toString()} )`,
      };
    }
    return {
      error: false,
    };
  }

  public static isSizeFile(file: any, maxMB: number): any {
    if (file.size > maxMB * 1024 * 1000) {
      let type = 'MB';
      if (maxMB >= 1024) {
        maxMB = Number((maxMB / 1024).toFixed(2));
        type = 'GB';
      }
      return {
        error: true,
        message: `El peso máximo del archivo es ${maxMB}${type}`,
      };
    }
    return {
      error: false,
    };
  }

  public static isSizeFileConfig(
    file: any,
    maxKB: number,
    textMaxKB: string = ''
  ): any {
    if (file.size > maxKB) {
      return {
        error: true,
        message: `El peso máximo del archivo "${file.name}" debe ser ${textMaxKB}`,
      };
    }
    return {
      error: false,
    };
  }

  public keyPressSoloNumeros(event: any): boolean {
    const key = event.key;
    return key >= '0' && key <= '9';
  }

  public keyPressSoloNumeroDecimal(event: any): boolean {
    const key = event.key;
    return (key >= '0' && key <= '9') || key === '.';
  }

  public changeFecha(event: any, minDate: any = null): boolean {
    const dateSelected = event.value;
    return minDate ? dateSelected >= minDate : true;
  }

  public hasErrors(fieldName: string): boolean {
    const control = this.frm.get(fieldName);
    return (
      control != null && control.invalid && (control.dirty || control.touched)
    );
  }

  public getErrorMessages(fieldName: string, controlName: string): string {
    const control = this.frm.get(fieldName);
    if (!control || !control.errors) {
      return '';
    }

    const errorMessages = [];
    if (control.errors['required']) {
      errorMessages.push(`El campo ${controlName} es requerido.`);
    }

    if (control.errors['email']) {
      errorMessages.push(`El ${controlName} no es válido.`);
    }

    if (control.errors['min']) {
      errorMessages.push(
        `El valor mínimo del campo ${controlName} es ${control.errors['min'].min}.`
      );
    }

    if (control.errors['max']) {
      errorMessages.push(
        `El valor máximo del campo ${controlName} es ${control.errors['max'].max}.`
      );
    }

    if (control.errors['minlength']) {
      errorMessages.push(
        `El mínimo de caracteres del campo ${controlName} es ${control.errors['minlength'].requiredLength}.`
      );
    }

    if (control.errors['maxlength']) {
      errorMessages.push(
        `El máximo de caracteres del campo ${controlName} es ${control.errors['maxlength'].requiredLength}.`
      );
    }

    if (control.errors['pattern']) {
      errorMessages.push(
        `El campo ${controlName} no cumple la regla: ${control.errors['pattern'].requiredPattern}`
      );
    }

    if (control.errors['noEspaciosEnBlanco']) {
      errorMessages.push(
        `${control.errors['noEspaciosEnBlanco'].messageError}`
      );
    }

    if (control.errors['soloDigitos']) {
      errorMessages.push(`${control.errors['soloDigitos'].messageError}`);
    }

    if (control.errors['isEntero']) {
      errorMessages.push(`${control.errors['isEntero'].messageError}`);
    }

    if (control.errors['isNumerico']) {
      errorMessages.push(`${control.errors['isNumerico'].messageError}`);
    }

    return errorMessages.join('<br>');
  }
}
