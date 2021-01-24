import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
    transform(items: any[], field: string, value: string): any[] {
        if (!value) {
            return items;
        }
        if (!items) {
            return [];
        }

        return items.filter(item => {
            if (typeof (item[field]) !== 'boolean') {
                return item[field].toLowerCase().includes((value as string)?.toLowerCase());
            } else {
                return (item[field]) === (value === 'true');
            }
        });
    }
}
