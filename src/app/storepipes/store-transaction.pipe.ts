import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'storeTransactionSearch'
})
export class StoreTransactionSearchPipe implements PipeTransform {
    transform(items: any[], searchDate: string, searchTime: string, searchEventId: string, searchTaskName: string, searchUserName: string, searchIssuedBy: string, searchReceivedBy: string, searchReferenceNo: string, searchRemarks: string) {
        if (items && items.length) {
            return items.filter(item => {
                if (searchDate && item.date_added.toLowerCase().indexOf(searchDate.toLowerCase()) === -1) {
                    return false;
                }
                if (searchTime && item.date_added.toLowerCase().indexOf(searchTime.toLowerCase()) === -1) {
                    return false;
                }
                if (searchEventId && item.event_id.toLowerCase().indexOf(searchEventId.toLowerCase()) === -1) {
                    return false;
                }
                if (searchTaskName && item.task_name.toLowerCase().indexOf(searchTaskName.toLowerCase()) === -1) {
                    return false;
                }
                if (searchUserName && item.user_name.toLowerCase().indexOf(searchUserName.toLowerCase()) === -1) {
                    return false;
                }
                if (searchIssuedBy && item.issued_by.toLowerCase().indexOf(searchIssuedBy.toLowerCase()) === -1) {
                    return false;
                }
                if (searchReceivedBy && item.received_by.toLowerCase().indexOf(searchReceivedBy.toLowerCase()) === -1) {
                    return false;
                }
                if (searchReferenceNo && item.refernce_no.toLowerCase().indexOf(searchReferenceNo.toLowerCase()) === -1) {
                    return false;
                }
                if (searchRemarks && item.remarks.toLowerCase().indexOf(searchRemarks.toLowerCase()) === -1) {
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