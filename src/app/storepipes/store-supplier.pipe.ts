import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'storeSupplierSearch'
})
export class StoreSupplierSearchPipe implements PipeTransform {
    transform(items: any[], searchsup_bus_name: string, searchsup_ref_name: string, searchcontact_person_name1: string, searchaddress1: string, searchcountry: string, searchcontact_person_name2: string, 
        searchaddress2: string, searchpo_box_no: string, searchtelephone1: string, searchtelephone2: string, searchtelephone3: string, 
        searchfax_no_1: string,searchfax_no_2: string,searchfax_no_3: string,searchemail1: string,searchemail2: string,searchwebsite: string,searchdescriptions: string) {
        if (items && items.length) {
            return items.filter(item => {
                if (searchsup_bus_name && item.sup_bus_name.toLowerCase().indexOf(searchsup_bus_name.toLowerCase()) === -1) {
                    return false;
                }
                if (searchsup_ref_name && item.sup_ref_name.toLowerCase().indexOf(searchsup_ref_name.toLowerCase()) === -1) {
                    return false;
                }
                if (searchcontact_person_name1 && item.contact_person_name1.toLowerCase().indexOf(searchcontact_person_name1.toLowerCase()) === -1) {
                    return false;
                }
                if (searchaddress1 && item.address1.toLowerCase().indexOf(searchaddress1.toLowerCase()) === -1) {
                    return false;
                }
                if (searchcountry && item.country.toLowerCase().indexOf(searchcountry.toLowerCase()) === -1) {
                    return false;
                }
                if (searchcontact_person_name2 && item.contact_person_name2.toLowerCase().indexOf(searchcontact_person_name2.toLowerCase()) === -1) {
                    return false;
                }
                if (searchaddress2 && item.address2.toLowerCase().indexOf(searchaddress2.toLowerCase()) === -1) {
                    return false;
                }
                if (searchpo_box_no && item.po_box_no.toLowerCase().indexOf(searchpo_box_no.toLowerCase()) === -1) {
                    return false;
                }
                if (searchtelephone1 && item.telephone1.toLowerCase().indexOf(searchtelephone1.toLowerCase()) === -1) {
                    return false;
                }
                if (searchtelephone2 && item.telephone2.toLowerCase().indexOf(searchtelephone2.toLowerCase()) === -1) {
                    return false;
                }
                if (searchtelephone3 && item.telephone3.toLowerCase().indexOf(searchtelephone3.toLowerCase()) === -1) {
                    return false;
                }
                if (searchfax_no_1 && item.fax_no_1.toLowerCase().indexOf(searchfax_no_1.toLowerCase()) === -1) {
                    return false;
                }
                if (searchfax_no_2 && item.fax_no_2.toLowerCase().indexOf(searchfax_no_2.toLowerCase()) === -1) {
                    return false;
                }
                if (searchfax_no_3 && item.fax_no_3.toLowerCase().indexOf(searchfax_no_3.toLowerCase()) === -1) {
                    return false;
                }
                if (searchemail1 && item.email1.toLowerCase().indexOf(searchemail1.toLowerCase()) === -1) {
                    return false;
                }
                if (searchemail2 && item.email2.toLowerCase().indexOf(searchemail2.toLowerCase()) === -1) {
                    return false;
                }
                if (searchwebsite && item.website.toLowerCase().indexOf(searchwebsite.toLowerCase()) === -1) {
                    return false;
                }
                if (searchdescriptions && item.description.toLowerCase().indexOf(searchdescriptions.toLowerCase()) === -1) {
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