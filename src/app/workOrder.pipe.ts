import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'workOrderSearch'
}) 

export class WorkOrderPipe implements PipeTransform {
    transform(items: any[], searchexTelephoneNo: string, Linkedno: string, EXSWOrder: string, searchManualWorkOrder: string, searchSetType: string, searchTypeOfWork: string, searchNoneNo: string, searchActNo: string, searchCCTNo: string, searchCampName: string, searchUnit: string, ExchangeNo: string, searchPosition: string, searchUserType: string, searchUserName: string, searchCreatedBy: string, searchCreatedDate: string, searchStatus: string, search_dp_telephone: string, searchdpname: string, searchDpLocation: string, searchWorkOrderDpCapacity: string, searchSwWorkOrderDpNo: string, searchSwWorkOrderPairNo: string, searchSwWorkOrderStatus: string, OoredooDp: string, Ooredoopair: string, OoredooMDF: string, dpCreatedBy: string, dpcreatedDate: string, DPRemarks: string, InstalledBy: string, InstalledDate: string, RecordedBy: string, MDFVFrom: string, MDFPFrom: string, CableInfoFrom: string, MDFVTo: string, MDFPTo: string, CableInfoTo: string, Dp_Add_Info: string, GNTelephone: string, RequestFrom: string, RequestTo: string, RequestBy: string, ApprovedBy: string, StoreDemandNo: string, RecordFile: string, CableInfo: string, CableDistance: string
        ) {
            let res: any = [];
        if (items && items.length) {
            return items.filter(item => {
                if (searchexTelephoneNo && (String(item.telephone_no).toLowerCase().indexOf(searchexTelephoneNo.toLowerCase()) === -1)){ // String(item.telephone_no).toLowerCase().indexOf(searchexTelephoneNo.toLowerCase()) === -1) {
                   return false;
                }
                if (Linkedno && Linkedno.toLowerCase() != item.linked.toLowerCase() ){ // String(item.linked).toLowerCase().indexOf(Linkedno.toLowerCase()) === -1) {
                    return false;
                }            
                if (searchWorkOrderDpCapacity && searchWorkOrderDpCapacity.toLowerCase() !=  item.dp_capacity.toLowerCase() ){ //String(item.dp_capacity).toLowerCase().indexOf(searchWorkOrderDpCapacity.toLowerCase()) === -1) {
                    return false;
                }
                if (EXSWOrder && EXSWOrder.toLowerCase() != item.sw_workorder_no.toLowerCase()){ //String(item.sw_workorder_no).toLowerCase().indexOf(EXSWOrder.toLowerCase()) === -1) {
                    return false;
                }
                if (searchManualWorkOrder && searchManualWorkOrder.toLowerCase() != item.manual_workorder_no.toLowerCase()){ //tring(item.manual_workorder_no).toLowerCase().indexOf(searchManualWorkOrder.toLowerCase()) === -1) {
                    return false;
                }
                if (searchSetType && searchSetType.toLowerCase() != item.set_type.toLowerCase()){ //.toLowerCase().indexOf(searchSetType.toLowerCase()) === -1.toLowerCase()) {
                    return false;
                }
                if (searchTypeOfWork && searchTypeOfWork.toLowerCase() != item.type_of_work.toLowerCase()){ //.toLowerCase().indexOf(searchTypeOfWork.toLowerCase()) === -1.toLowerCase()) {
                    return false;
                }
                if (searchNoneNo && searchNoneNo.toLowerCase() != item.node_no.toLowerCase()){ //.toLowerCase().indexOf(searchNoneNo.toLowerCase()) === -1.toLowerCase()) {
                    return false;
                }
                if (searchActNo && searchActNo.toLowerCase() != item.act_no.toLowerCase()){ //.toLowerCase().indexOf(searchActNo.toLowerCase()) === -1.toLowerCase()) {
                    return false;
                }
                if (searchCCTNo && searchCCTNo.toLowerCase() != item.cct_no.toLowerCase()){ //.toLowerCase().indexOf(searchCCTNo.toLowerCase()) === -1.toLowerCase()) {
                    return false;
                }
                if (searchCampName && searchCampName.toLowerCase() != item.camp_name.toLowerCase()){ //}.toLowerCase().indexOf(searchCampName.toLowerCase()) === -1.toLowerCase()) {
                    return false;
                }
                if (searchUnit && searchUnit.toLowerCase() != item.unit.toLowerCase()){ //}.toLowerCase().indexOf(searchUnit.toLowerCase()) === -1.toLowerCase()) {
                    return false;
                } 
                if (ExchangeNo && ExchangeNo.toLowerCase() != item.exchange.toLowerCase()){ //}.toLowerCase().indexOf(ExchangeNo.toLowerCase()) === -1.toLowerCase()) {
                    return false;
                }
                if (searchPosition && searchPosition.toLowerCase() != item.position.toLowerCase()){ //}.toLowerCase().indexOf(searchPosition.toLowerCase()) === -1.toLowerCase()) {
                    return false;
                }
                if (searchUserType && searchUserType.toLowerCase() != item.user_type.toLowerCase()){ //}.toLowerCase().indexOf(searchUserType.toLowerCase()) === -1.toLowerCase()) {
                    return false;
                }
                if (searchUserName && searchUserName.toLowerCase() != item.user_name.toLowerCase()){ //}.toLowerCase().indexOf(searchUserName.toLowerCase()) === -1.toLowerCase()) {
                    return false;
                }
                if (searchCreatedBy && searchCreatedBy.toLowerCase() != item.created_by.toLowerCase()){ //}.toLowerCase().indexOf(searchCreatedBy.toLowerCase()) === -1.toLowerCase()) {
                    return false;
                }
                if (searchCreatedDate && searchCreatedDate != item.created_date){ //}.toLowerCase().indexOf(searchCreatedDate.toLowerCase()) === -1.toLowerCase()) {
                    return false;
                }
                if (searchStatus && searchStatus.toLowerCase() != item.status.toLowerCase()){ //}).toLowerCase().indexOf(searchStatus.toLowerCase()) === -1.toLowerCase()) {
                    return false;
                }
                if (searchSwWorkOrderDpNo && searchSwWorkOrderDpNo.toLowerCase() !=  item.dp_no.toLowerCase()){ //String(item.dp_no).toLowerCase().indexOf(searchSwWorkOrderDpNo.toLowerCase()) === -1.toLowerCase()) {
                    return false;
                }
                if (searchSwWorkOrderPairNo && searchSwWorkOrderPairNo.toLowerCase() != item.dp_pair.toLowerCase()){ //String(item.dp_pair).toLowerCase().indexOf(searchSwWorkOrderPairNo.toLowerCase()) === -1.toLowerCase()) {
                    return false;
                }                  
                if (searchSwWorkOrderStatus && searchSwWorkOrderStatus.toLowerCase() != item.dp_dpstatus.toLowerCase()){ //String(item.dp_dpstatus).toLowerCase().indexOf(searchSwWorkOrderStatus.toLowerCase()) === -1.toLowerCase()) {
                    return false;
                }
                if (search_dp_telephone && search_dp_telephone.toLowerCase() != item.dp_telephone_no.toLowerCase()){ //String(item.dp_telephone_no).toLowerCase().indexOf(search_dp_telephone.toLowerCase()) === -1.toLowerCase()) {
                    return false;
                }
                if (searchdpname && searchdpname.toLowerCase() != item.dp_name.toLowerCase()){ //String(item.dp_name).toLowerCase().indexOf(searchdpname.toLowerCase()) === -1.toLowerCase()) {
                    return false;
                }                          
                if (searchDpLocation && searchDpLocation.toLowerCase() != item.dp_location.toLowerCase()){ //String(item.dp_location).toLowerCase().indexOf(searchDpLocation.toLowerCase()) === -1.toLowerCase()) {
                    return false;
                }
                if(OoredooDp && OoredooDp.toLowerCase() !=  item.dp_ooredoodp.toLowerCase()){ //String(item.dp_ooredoodp).toLowerCase().indexOf(OoredooDp.toLowerCase()) === -.toLowerCase()1.toLowerCase()){
                    return false;
                }
                if(Ooredoopair && Ooredoopair.toLowerCase() != item.dp_ooredoopair.toLowerCase()){ //String(item.dp_ooredoopair).toLowerCase().indexOf(Ooredoopair.toLowerCase()) === -.toLowerCase()1.toLowerCase()){
                    return false;
                }
                if(OoredooMDF && OoredooMDF.toLowerCase() != item.dp_ooredoomdf.toLowerCase()){ //String(item.dp_ooredoomdf).toLowerCase().indexOf(OoredooMDF.toLowerCase()) === -.toLowerCase()1.toLowerCase()){
                    return false;
                }
                if(dpCreatedBy && dpCreatedBy.toLowerCase() != item.dp_createdby.toLowerCase()){ //String(item.dp_createdby).toLowerCase().indexOf(dpCreatedBy.toLowerCase()) === -.toLowerCase()1.toLowerCase()){
                    return false;
                }
                if(dpcreatedDate && dpcreatedDate.toLowerCase() != item.dp_createddate.toLowerCase()){ //String(item.dp_createddate).toLowerCase().indexOf(dpcreatedDate.toLowerCase()) === -.toLowerCase()1.toLowerCase()){
                    return false;
                }
                if( DPRemarks && DPRemarks.toLowerCase() != item.dp_remarks.toLowerCase()){ //} String(item.dp_remarks).toLowerCase().indexOf(DPRemarks.toLowerCase()) === -1.toLowerCase()).toLowerCase()){
                    return false;
                }
                if(InstalledBy && InstalledBy.toLowerCase() != item.dp_installedby.toLowerCase()){ //String(item.dp_installedby).toLowerCase().indexOf(InstalledBy.toLowerCase()) === -.toLowerCase()1.toLowerCase()){
                    return false;
                }
                if(InstalledDate && InstalledDate.toLowerCase() !=  item.dp_installeddate.toLowerCase()){ //String(item.dp_installeddate).toLowerCase().indexOf(InstalledDate.toLowerCase()) === -.toLowerCase()1.toLowerCase()){
                    return false;
                }
                if(RecordedBy && RecordedBy.toLowerCase() != item.dp_recordedby.toLowerCase()){ //String(item.dp_recordedby).toLowerCase().indexOf(RecordedBy.toLowerCase()) === -.toLowerCase()1.toLowerCase()){
                    return false;
                }
                if(MDFVFrom && MDFVFrom.toLowerCase() != item.dp_mdfverticalfrom.toLowerCase()){ //String(item.dp_mdfverticalfrom).toLowerCase().indexOf(MDFVFrom.toLowerCase()) === -.toLowerCase()1.toLowerCase()){
                    return false;
                }
                if(MDFPFrom && MDFPFrom.toLowerCase() !=  item.dp_mdfpairnofrom.toLowerCase()){ //String(item.dp_mdfpairnofrom).toLowerCase().indexOf(MDFPFrom.toLowerCase()) === -.toLowerCase()1.toLowerCase()){
                    return false;
                }
                if(CableInfoFrom && CableInfoFrom.toLowerCase() != item.dp_cablenofrom.toLowerCase()){ //String(item.dp_cablenofrom).toLowerCase().indexOf(CableInfoFrom.toLowerCase()) === -.toLowerCase()1.toLowerCase()){
                    return false;
                }
                if(MDFVTo && MDFVTo.toLowerCase() !=  item.dp_mdfverticalto.toLowerCase()){ //String(item.dp_mdfverticalto).toLowerCase().indexOf(MDFVTo.toLowerCase()) === -.toLowerCase()1.toLowerCase()){
                    return false;
                }
                if(MDFPTo && MDFPTo.toLowerCase() != item.dp_pairnoto.toLowerCase()){ //String(item.dp_pairnoto).toLowerCase().indexOf(MDFPTo.toLowerCase()) === -.toLowerCase()1.toLowerCase()){
                    return false;
                }
                if(CableInfoTo && CableInfoTo.toLowerCase() != item.dp_cablenoto.toLowerCase()){ //String(item.dp_cablenoto).toLowerCase().indexOf(CableInfoTo.toLowerCase()) === -.toLowerCase()1.toLowerCase()){
                    return false;
                }
                if(Dp_Add_Info && Dp_Add_Info.toLowerCase() != item.dp_additionalinfo.toLowerCase()){ //String(item.dp_additionalinfo).toLowerCase().indexOf(Dp_Add_Info.toLowerCase()) === -.toLowerCase()1.toLowerCase()){
                    return false;
                }
                if(GNTelephone && GNTelephone.toLowerCase() != item.gn_telephone.toLowerCase()){ //String(item.gn_telephone).toLowerCase().indexOf(GNTelephone.toLowerCase()) === -.toLowerCase()1.toLowerCase()){
                    return false;
                }
                if(RequestFrom && RequestFrom.toLowerCase() != item.gn_requestfrom.toLowerCase()){ //String(item.gn_requestfrom).toLowerCase().indexOf(RequestFrom.toLowerCase()) === -.toLowerCase()1.toLowerCase()){
                    return false;
                }
                if(RequestTo && RequestTo.toLowerCase() != item.gn_requestto.toLowerCase()){ //String(item.gn_requestto).toLowerCase().indexOf(RequestTo.toLowerCase()) === -.toLowerCase()1.toLowerCase()){
                    return false;
                }
                if(RequestBy && RequestBy.toLowerCase() !=  item.gn_requestby.toLowerCase()){ //String(item.gn_requestby).toLowerCase().indexOf(RequestBy.toLowerCase()) === -.toLowerCase()1.toLowerCase()){
                    return false;
                }
                if(ApprovedBy && ApprovedBy.toLowerCase() != item.gn_approvedby) { //String(item.gn_approvedby).toLowerCase().indexOf(ApprovedBy.toLowerCase()) === -.toLowerCase()1.toLowerCase()){
                    return false;
                }
                if(StoreDemandNo && StoreDemandNo.toLowerCase() != item.gn_storedemandno.toLowerCase()){ //String(item.gn_storedemandno).toLowerCase().indexOf(StoreDemandNo.toLowerCase()) === -.toLowerCase()1.toLowerCase()){
                    return false;
                }
                if(RecordFile && RecordFile.toLowerCase() != item.gn_recordfileno.toLowerCase()){ //String(item.gn_recordfileno).toLowerCase().indexOf(RecordFile.toLowerCase()) === -.toLowerCase()1.toLowerCase()){
                    return false;
                }
                if(CableInfo && CableInfo.toLowerCase() != item.gn_cableno.toLowerCase()){ //String(item.gn_cableno).toLowerCase().indexOf(CableInfo.toLowerCase()) === -.toLowerCase()1.toLowerCase()){
                    return false;
                }
                if(CableDistance && CableDistance.toLowerCase() !=  item.gn_cabledistance.toLowerCase()){ //String(item.gn_cabledistance).toLowerCase().indexOf(CableDistance.toLowerCase()) === -.toLowerCase()1){
                    return false;
                }
                return res
                // return true;
            })
        }
        else {
            return items;
        }
    }
}