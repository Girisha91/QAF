import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'externalLineSearch'
})
export class ExternalLinePipe implements PipeTransform {
    transform(items: any[], searchCategory: string, searchAccountNo: string, searchTelephoneNo: string, searchOoredooCustomerNo: string, searchAuthority: string, searchDateInstallation: string, searchDistributionMenu: string
        , searchDistributionUnit: string, searchLocation: string, searchRequestRefNo: string, searchUserName: string, searchTypeService: string, searchCustomerName: string, searchDidNumberRange: string,
        searchPackage: string, searchMdfInfo: string, searchDpInfo: string, searchConnectedWallSocketInfo: string) {
        if (items && items.length) {
            return items.filter(item => {
                if (searchCategory && item.category.toLowerCase().indexOf(searchCategory.toLowerCase()) === -1) {
                    return false;
                }
                if (searchAccountNo && item.account_no.toLowerCase().indexOf(searchAccountNo.toLowerCase()) === -1) {
                    return false;
                }
                if (searchTelephoneNo && item.telephone_no.toLowerCase().indexOf(searchTelephoneNo.toLowerCase()) === -1) {
                    return false;
                }
                if (searchOoredooCustomerNo && item.Ooredoo_Customer_no.toLowerCase().indexOf(searchOoredooCustomerNo.toLowerCase()) === -1) {
                    return false;
                }
                if (searchAuthority && item.authority.toLowerCase().indexOf(searchAuthority.toLowerCase()) === -1) {
                    return false;
                }
                if (searchDateInstallation && item.date_installation.toLowerCase().indexOf(searchDateInstallation.toLowerCase()) === -1) {
                    return false;
                }
                if (searchDistributionMenu && item.Distribution_Menu.toLowerCase().indexOf(searchDistributionMenu.toLowerCase()) === -1) {
                    return false;
                }
                if (searchDistributionUnit && item.Distribution_Unit.toLowerCase().indexOf(searchDistributionUnit.toLowerCase()) === -1) {
                    return false;
                }
                if (searchLocation && item.location.toLowerCase().indexOf(searchLocation.toLowerCase()) === -1) {
                    return false;
                }
                if (searchRequestRefNo && item.request_refe_no.toLowerCase().indexOf(searchRequestRefNo.toLowerCase()) === -1) {
                    return false;
                }
                if (searchUserName && item.username.toLowerCase().indexOf(searchUserName.toLowerCase()) === -1) {
                    return false;
                }
                if (searchTypeService && item.type_service.toLowerCase().indexOf(searchTypeService.toLowerCase()) === -1) {
                    return false;
                }
                if (searchCustomerName && item.customer_name.toLowerCase().indexOf(searchCustomerName.toLowerCase()) === -1) {
                    return false;
                }
                if (searchDidNumberRange && item.did_number_range.toLowerCase().indexOf(searchDidNumberRange.toLowerCase()) === -1) {
                    return false;
                }
                if (searchPackage && item.package.toLowerCase().indexOf(searchPackage.toLowerCase()) === -1) {
                    return false;
                }
                if (searchMdfInfo && item.mdf_info.toLowerCase().indexOf(searchMdfInfo.toLowerCase()) === -1) {
                    return false;
                }
                if (searchDpInfo && item.dp_info.toLowerCase().indexOf(searchDpInfo.toLowerCase()) === -1) {
                    return false;
                }
                if (searchConnectedWallSocketInfo && item.connected_wall_socket_info.toLowerCase().indexOf(searchConnectedWallSocketInfo.toLowerCase()) === -1) {
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