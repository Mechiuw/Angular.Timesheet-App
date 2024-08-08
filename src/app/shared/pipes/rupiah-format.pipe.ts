import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rupiahFormat',
  standalone: true
})
export class RupiahFormatPipe implements PipeTransform {

  transform(value: number): string {
    // Convert number to string
    let formattedValue = value.toLocaleString('id-ID');

    // Replace comma with dot
    formattedValue = formattedValue.replace(",", '.');

    // Add currency symbol
    formattedValue = `Rp. ${formattedValue},00`;

    return formattedValue;
  }

}