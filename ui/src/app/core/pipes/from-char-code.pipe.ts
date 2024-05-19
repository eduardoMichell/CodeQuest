import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fromCharCode'
})
export class FromCharCodePipe implements PipeTransform {
  transform(value: number): string {
    return String.fromCharCode(value);
  }
}
