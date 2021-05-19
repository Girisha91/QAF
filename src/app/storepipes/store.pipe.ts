import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'storeSearch'
})
export class StoreSearchPipe implements PipeTransform {
    transform(items: any[], searchPurchaseOrderNo: string, searchSupplier: string, searchDepartment: string, searchDeliveryNoteNo: string, searchSupplierOrderRefNo: string, searchVendorName: string, searchQAFOrderRefNo: string, searchDeliveryDate: string, searchDescriptionOfPurchase: string) {
        if (items && items.length) {
            return items.filter(item => {
                if (searchPurchaseOrderNo && item.purchase_order_no.toLowerCase().indexOf(searchPurchaseOrderNo.toLowerCase()) === -1) {
                    return false;
                }
                if (searchSupplier && item.sup_ref_name.toLowerCase().indexOf(searchSupplier.toLowerCase()) === -1) {
                    return false;
                }
                if (searchDepartment && item.department.toLowerCase().indexOf(searchDepartment.toLowerCase()) === -1) {
                    return false;
                }
                if (searchDeliveryNoteNo && item.delivery_note_no.toLowerCase().indexOf(searchDeliveryNoteNo.toLowerCase()) === -1) {
                    return false;
                }
                if (searchSupplierOrderRefNo && item.sup_ord_ref_no.toLowerCase().indexOf(searchSupplierOrderRefNo.toLowerCase()) === -1) {
                    return false;
                }
                if (searchVendorName && item.vendor_name.toLowerCase().indexOf(searchVendorName.toLowerCase()) === -1) {
                    return false;
                }
                if (searchQAFOrderRefNo && item.QAF_ord_ref_no.toLowerCase().indexOf(searchQAFOrderRefNo.toLowerCase()) === -1) {
                    return false;
                }
                if (searchDeliveryDate && item.delivery_date.toLowerCase().indexOf(searchDeliveryDate.toLowerCase()) === -1) {
                    return false;
                }
                if (searchDescriptionOfPurchase && item.description.toLowerCase().indexOf(searchDescriptionOfPurchase.toLowerCase()) === -1) {
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