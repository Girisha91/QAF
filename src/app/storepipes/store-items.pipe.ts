import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'storeItemSearch'
})
export class StoreItemsSearchPipe implements PipeTransform {
    transform(items: any[], searchStatus :string , searchItemName: string, searchItemNo: string,
        searchItemPartNo: string, searchCategory: string, searchQuantity: string, searchVendorName: string, searchDescriptions: string, searchDepartment: string) {
        if (items && items.length) {
            return items.filter(item => {
                // if (searchPurchaseOrderNo && item.purchase_order_no.toLowerCase().indexOf(searchPurchaseOrderNo.toLowerCase()) === -1) {
                //     return false;
                // }
                // if (searchParcelNo && item.parcel_no.toLowerCase().indexOf(searchParcelNo.toLowerCase()) === -1) {
                //     return false;
                // }String(item.Order)
                if (searchStatus && (item.Materialstatus).toLowerCase().indexOf(searchStatus.toLowerCase()) === -1) {
                    return false;
                }
                if (searchItemName && item.item_name.toLowerCase().indexOf(searchItemName.toLowerCase()) === -1) {
                    return false;
                }
                if (searchItemNo && item.item_no.toLowerCase().indexOf(searchItemNo.toLowerCase()) === -1) {
                    return false;
                }
                // if (searchAltItemNo && item.alt_item_no.toLowerCase().indexOf(searchAltItemNo.toLowerCase()) === -1) {
                //     return false;
                // }
                if (searchItemPartNo && item.part_no.toLowerCase().indexOf(searchItemPartNo.toLowerCase()) === -1) {
                    return false;
                }
                if (searchCategory && item.category.toLowerCase().indexOf(searchCategory.toLowerCase()) === -1) {
                    return false;
                }
                if (searchQuantity && item.quantity.toLowerCase().indexOf(searchQuantity.toLowerCase()) === -1) {
                    return false;
                }
                // if (searchManufatureItem && item.manufacture_item.toLowerCase().indexOf(searchManufatureItem.toLowerCase()) === -1) {
                //     return false;
                // }
                if (searchVendorName && item.vendor.toLowerCase().indexOf(searchVendorName.toLowerCase()) === -1) {
                    return false;
                }
                // if (searchWarranty && item.warranty.toLowerCase().indexOf(searchWarranty.toLowerCase()) === -1) {
                //     return false;
                // }
                if (searchDescriptions && item.description.toLowerCase().indexOf(searchDescriptions.toLowerCase()) === -1) {
                    return false;
                }
                if (searchDepartment && item.department.toLowerCase().indexOf(searchDepartment.toLowerCase()) === -1) {
                    return false;
                }
                // if (searchRemarks && item.remarks.toLowerCase().indexOf(searchRemarks.toLowerCase()) === -1) {
                //     return false;
                // }
                // if (searchSerialNo && item.remarks.toLowerCase().indexOf(searchSerialNo.toLowerCase()) === -1) {
                //     return false;
                // }

                // if (searchItemStatus && item.remarks.toLowerCase().indexOf(searchItemStatus.toLowerCase()) === -1) {
                //     return false;
                // }
                // if (searchStatus && item.remarks.toLowerCase().indexOf(searchStatus.toLowerCase()) === -1) {
                //     return false;
                // }
                return true;
             
            })

        }
        else {
            return items;
        }
    }
}