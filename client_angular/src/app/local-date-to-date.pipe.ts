import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localDateToDate'
})
export class LocalDateToDatePipe implements PipeTransform {

  transform(value: string | Date): Date {
    // Si c'est déjà un objet Date, retournez-le directement
    if (value instanceof Date) {
      return value;
    }
    // Si c'est une chaîne (ex: "2023-12-31"), convertissez-la en Date
    if (typeof value === 'string') {
      return new Date(value);
    }
    // Sinon, retournez une Date invalide (ou null si préférable)
    return new Date(NaN);
  }
}
