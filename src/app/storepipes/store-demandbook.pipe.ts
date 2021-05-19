import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'storeDemandBookSearch'
})
export class storeDemandBookSearchPipe implements PipeTransform {
    transform(items: any[], searchGenratedDBNo: string, searchDate: string, searchFormType: string, searchDepartment : string , searchIssuedBy : string , searchManualDBNo: string, searchMonitoring: string, searchControlNo: string, searchReferenceNo: string, searchRequestParty: string
        , searchRecipient: string, searchDistributor: string, searchWHOfficer: string, searchWHCommander: string, searchApplicant: string, searchForceCommanderApproval: string ,searchOperationalRecommendations: string , searchFinancialNotes: string ) {
        if (items && items.length) {
            return items.filter(item => {

                if (searchGenratedDBNo && item.material_demand_no.indexOf(searchGenratedDBNo.toLowerCase()) === -1) {
                    return false;
                }
                if (searchDate && item.date_issued.toLowerCase().indexOf(searchDate.toLowerCase()) === -1) {
                    return false;
                }
                if (searchFormType && item.form_type.toLowerCase().search(searchFormType.toLowerCase()) === -1) {
                    return false;
                }
             
                // if (searchFormType && !item.form_type.toLowerCase().match(searchFormType.toLowerCase())) {
                //     return false;
                // }
                // if(item.form_type.toLowerCase().match(searchFormType.toLowerCase())){
                //     return false;
                // }
                if (searchDepartment && item.department.toLowerCase().indexOf(searchDepartment.toLowerCase()) === -1) {
                    return false;
                }
                if (searchIssuedBy && item.issued_by.toLowerCase().indexOf(searchIssuedBy.toLowerCase()) === -1) {
                    return false;
                }
                if (searchManualDBNo && item.manual_demand_no.toLowerCase().indexOf(searchManualDBNo.toLowerCase()) === -1) {
                    return false;
                }
                if (searchMonitoring && item.monitoring.toLowerCase().indexOf(searchMonitoring.toLowerCase()) === -1) {
                    return false;
                }
                if (searchControlNo && item.control_no.toLowerCase().indexOf(searchControlNo.toLowerCase()) === -1) {
                    return false;
                }
                if (searchReferenceNo && item.reference_no.toLowerCase().indexOf(searchReferenceNo.toLowerCase()) === -1) {
                    return false;
                }
                if (searchRequestParty && item.request_party.toLowerCase().indexOf(searchRequestParty.toLowerCase()) === -1) {
                    return false;
                }
                if (searchRecipient && item.recipient.toLowerCase().indexOf(searchRecipient.toLowerCase()) === -1) {
                    return false;
                }
                if (searchDistributor && item.distributor.toLowerCase().indexOf(searchDistributor.toLowerCase()) === -1) {
                    return false;
                }
                if (searchWHOfficer && item.warehouse_officer.toLowerCase().indexOf(searchWHOfficer.toLowerCase()) === -1) {
                    return false;
                }
                if (searchWHCommander && item.warehouse_commander.toLowerCase().indexOf(searchWHCommander.toLowerCase()) === -1) {
                    return false;
                }
                if (searchApplicant && item.applicant.toLowerCase().indexOf(searchApplicant.toLowerCase()) === -1) {
                    return false;
                }
                if (searchForceCommanderApproval && item.force_commander_approval.toLowerCase().indexOf(searchForceCommanderApproval.toLowerCase()) === -1) {
                    return false;
                }
                if (searchFinancialNotes && item.financial_notes.toLowerCase().indexOf(searchFinancialNotes.toLowerCase()) === -1) {
                    return false;
                }
                if (searchOperationalRecommendations && item.operational_recommendations.toLowerCase().indexOf(searchOperationalRecommendations.toLowerCase()) === -1) {
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