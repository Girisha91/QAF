import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'pabxTopologySearch'
})
export class pabxTopologySearchPipe implements PipeTransform {
    transform(items: any[], searchFileName: string, searchDescription: string, searchDate: string) {
        if (items && items.length) {
            return items.filter(item => {
                if (searchFileName && item.filename.toLowerCase().indexOf(searchFileName.toLowerCase()) === -1) {
                    return false;
                }
                if (searchDescription && item.description.toLowerCase().indexOf(searchDescription.toLowerCase()) === -1) {
                    return false;
                }
                if (searchDate && item.added_at.toLowerCase().indexOf(searchDate.toLowerCase()) === -1) {
                    return false;
                }
                return true;
            })
        }
        else {
            return items;
        }
    }
}