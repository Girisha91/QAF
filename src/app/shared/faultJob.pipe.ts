import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'faultJobSearch'
})
export class FaultJobPipe implements PipeTransform {
    transform(items: any[], searchOpNumber: string, searchOpStatus:string, searchOpCreatedDate: string, searchOpAssignDate: string,
         searchSiteName : string , searchDepartment : string , searchSeverity: string, searchOpSubType: string, 
         searchOpType: string, searchReportedBy: string, searchReportedTo: string
        , searchrequested_by: string, searchDescription: string,) {
        if (items && items.length) {
            return items.filter(item => {

                if (searchOpNumber && item.ticket_number.toLowerCase().indexOf(searchOpNumber.toLowerCase()) === -1) {
                    return false;
                }
                
                if (searchOpStatus && item.ticket_status.toLowerCase().indexOf(searchOpStatus.toLowerCase()) === -1) {
                    return false;
                }
                if (searchOpCreatedDate && item.created_date.toLowerCase().indexOf(searchOpCreatedDate.toLowerCase()) === -1) {
                    return false;
                }
                if (searchOpAssignDate && item.assigned_date.toLowerCase().search(searchOpAssignDate.toLowerCase()) === -1) {
                    return false;
                }
                if (searchSiteName && item.site_name.toLowerCase().indexOf(searchSiteName.toLowerCase()) === -1) {
                    return false;
                }
                if (searchDepartment && item.department.toLowerCase().indexOf(searchDepartment.toLowerCase()) === -1) {
                    return false;
                }
                if (searchSeverity && item.severity.toLowerCase().indexOf(searchSeverity.toLowerCase()) === -1) {
                    return false;
                }
                if (searchOpSubType && item.operation_sub_type.toLowerCase().indexOf(searchOpSubType.toLowerCase()) === -1) {
                    return false;
                }
                if (searchOpType && item.operation_type.toLowerCase().indexOf(searchOpType.toLowerCase()) === -1) {
                    return false;
                }
                if (searchReportedBy && item.operation_reported_by.toLowerCase().indexOf(searchReportedBy.toLowerCase()) === -1) {
                    return false;
                }
                if (searchReportedTo && item.operation_reported_to_names.toLowerCase().indexOf(searchReportedTo.toLowerCase()) === -1) {
                    return false;
                }
                if (searchrequested_by && item.requested_by.toLowerCase().indexOf(searchrequested_by.toLowerCase()) === -1) {
                    return false;
                }
                if (searchDescription && item.description.toLowerCase().indexOf(searchDescription.toLowerCase()) === -1) {
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

