import {Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'employeeSearch'
})
export class EmployeeSearchPipe implements PipeTransform {
    transform(items: any[] ,idSearch:string, nameSearch: string, rankSearch: string,distributionListSearch:string,distributionUnitSearch:string ,positionSearch: string, companySearch: string){
        if (items && items.length){
            return items.filter(item =>{
                if (idSearch && String(item.MilitaryId).toLowerCase().indexOf(idSearch.toLowerCase()) === -1){
                    return false;
                }
                if (nameSearch && item.Name.toLowerCase().indexOf(nameSearch.toLowerCase()) === -1){
                    return false;
                }
                if (rankSearch  && item.Rank.toLowerCase().indexOf(rankSearch.toLowerCase()) === -1){
                    return false;
                }
                if (distributionListSearch && item.distributionList.toLowerCase().indexOf(distributionListSearch.toLowerCase()) === -1){
                    return false;
                }
                if (distributionUnitSearch && item.distributionUnit.toLowerCase().indexOf(distributionUnitSearch.toLowerCase()) === -1){
                    return false;
                }
                if (positionSearch && item.Position.toLowerCase().indexOf(positionSearch.toLowerCase()) === -1){
                    return false;
                }
                if (companySearch && item.Company.toLowerCase().indexOf(companySearch.toLowerCase()) === -1){
                    return false;
                }
                return true;
           })
        }
        else{
            return items;
        }
    }
}