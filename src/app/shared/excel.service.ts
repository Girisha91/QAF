import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx/types';
import 'rxjs/Rx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
declare var $: any;
@Injectable()
export class ExcelService {

  constructor() { }

  download(data: any[], fileName: string) {
    var csvData = this.ConvertToCSV(data);
    var blob = new Blob([csvData], { type: 'text/csv' });
    if (window.navigator.msSaveOrOpenBlob) {  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
      window.navigator.msSaveBlob(blob,  fileName + '.csv');
    }
    else {
      var a = window.document.createElement("a");
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      var url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName + '.csv';
      a.click();
    }
  }

//   download(data:any[],fileName:string){
//     var csvData = this.ConvertToCSV(data);
//     var a = document.createElement("a");
//     a.setAttribute('style', 'display:none;');
//     document.body.appendChild(a);
//     var blob = new Blob([csvData], { type: 'text/csv' });
//     var url= window.URL.createObjectURL(blob);
//     a.href = url;
//     a.download = fileName+'.csv';
//     a.click();
// }

  private ConvertToCSV(objArray: any[]) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var row = "";
    for (var index in objArray[0]) {
      //Now convert each value to string and comma-separated
      // console.log(objArray[0][index]);
      row += index + ',';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + '\r\n';
    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','
        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}