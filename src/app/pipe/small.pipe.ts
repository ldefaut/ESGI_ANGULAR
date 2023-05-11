import { Pipe, PipeTransform } from '@angular/core';
import {Task} from "../components/task/task";

@Pipe({
  name: 'small'
})
export class SmallPipe implements PipeTransform {

  transform(value: string | undefined, length: number): unknown {
    if (value === undefined) {
      return '';
    }
    if (value.length <= length) {
      return value;
    }
    return value.substr(0, length) + '...';
  }

}
