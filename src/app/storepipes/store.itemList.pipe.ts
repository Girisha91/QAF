import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'storeItemListSearch'
})
export class StoreItemListSearchPipe implements PipeTransform {
    transform(items: any[], searchItemName: string, searchItemNo: string, searchPartNo: string, searchDescription: string, searchCategory: string, searchDepartment: string, searchManufacture: string, searchVendor: string, searchSupplierName: string ,searchWarranty:string, searchThresholdqty :string) {
        if (items && items.length) {
            return items.filter(item => {
                if (searchItemName && item.item_name.toLowerCase().indexOf(searchItemName.toLowerCase()) === -1) {
                    return false;             
                }
                if (searchItemNo && item.item_no.toLowerCase().indexOf(searchItemNo.toLowerCase()) === -1) {
                    return false;
                }
                if (searchPartNo && item.part_no.toLowerCase().indexOf(searchPartNo.toLowerCase()) === -1) {
                    return false;
                }
                if (searchDescription && item.description.toLowerCase().indexOf(searchDescription.toLowerCase()) === -1) {
                    return false;
                }
                if (searchCategory && item.category.toLowerCase().indexOf(searchCategory.toLowerCase()) === -1) {
                    return false;
                }
                if (searchDepartment && item.department.toLowerCase().indexOf(searchDepartment.toLowerCase()) === -1) {
                    return false;
                }
                if (searchManufacture && item.manufacture.toLowerCase().indexOf(searchManufacture.toLowerCase()) === -1) {
                    return false;
                }
                if (searchVendor && item.vendor.toLowerCase().indexOf(searchVendor.toLowerCase()) === -1) {
                    return false;
                }
                if (searchSupplierName && String(item.supplier_id).toLowerCase().indexOf(searchSupplierName.toLowerCase()) === -1) {
                    return false;
                }
                if (searchWarranty && String(item.warranty).toLowerCase().indexOf(searchWarranty.toLowerCase()) === -1) {
                    return false;
                }
                if (searchThresholdqty && String(item.reorder_qty).toLowerCase().indexOf(searchThresholdqty.toLowerCase()) === -1) {
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