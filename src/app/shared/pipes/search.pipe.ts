import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(order, search : string = "") {
    if (!search.trim()) {
      return order
    }

    return order.filter(ord => {
      return ord.id.includes(search);
    })
  }

}
