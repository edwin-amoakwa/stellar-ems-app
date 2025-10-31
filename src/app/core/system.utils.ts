import { formatDate } from "@angular/common";
import { UntypedFormGroup } from '@angular/forms';

export class CollectionUtil
{
    public static add(originalList:any[], item:any,addToLast:boolean=false):void
    {
        // console.log("original", originalList);
        // console.log("item", item);

      if(originalList == null)
      {
        return;
      }

        if(!item)
        {
            return;
        }

        if(item.id == null || item.id == undefined)
        {
            originalList.push(item);
            return;
        }

        let itemFound = false;
        let counter:number = 0;
        let foundIndex:number = 0;

        // if(originalList.indexOf(item) != -1)
        // {
        //     let index = originalList.indexOf(item);
        //     originalList[index] = item;
        //     return ;
        // }

        // if(!item.id)
        // {
        //     originalList.push(item);
        //     return;
        // }

        originalList.forEach((element)=>{
            if(element.id == item.id)
            {
                // console.log("item found");
                itemFound = true;
                foundIndex = counter;
            }
            else
            {
                counter++;
            }
        });

        // console.log("item found", itemFound);

        if(itemFound)
        {
            // console.log("foundIndex --- ", foundIndex);
            originalList[foundIndex] = item;
        }
        else
        {
            // originalList.push(item);
            if(addToLast)
            {
              originalList.push(item);
            }
            else
            {
              originalList.unshift(item);
            }
        }

        // console.log("final list .. ", originalList);
    }

    public static remove(originalList:any[], id:string):void
    {
        if(id == null)
        {
            return;
        }

        let counter:number = 0;

        originalList.forEach((element)=>{
            if(element.id == id)
            {
                originalList.splice(counter,1);
                return;
            }
            counter++;
        });

    }

    public static findById(originalList:any[], id:string)
    {
      if(originalList == null || originalList == undefined)
      {
        return null;
      }
        // console.log("original", originalList);
        console.log("checking for id", id);

        if(id == null)
        {
            return null;
        }

        let counter:number = 0;

        let found = originalList.find(element => element?.id == id);
        // let found = originalList.find(element => {
        //     console.log(counter," element.id:",element.id);
        //     element.id == id
        // });

        // originalList.forEach((element)=>{
        //     console.log(`comparing -- ${element.id} and ${id}`);
        //     if(element.id == id)
        //     {
        //         // originalList.splice(counter,1);
        //         return element;

        //     }

            // counter++;

        // });

        return found;
    }

    public static replaceItemAtIndex<T>(array: T[], index: number, newItem: T): T[] {
      if (index < 0 || index >= array.length) {
        throw new Error('Index out of bounds');
      }

      return [...array.slice(0, index), newItem, ...array.slice(index + 1)];
    }
}

export class DateUtil {
  public static getCurrentDate() {
    // new Date().toISOString().substring(0, 10);
    return formatDate(new Date(), 'yyyy-MM-dd', 'en');
  }

  public static toDate(jsDateObject) {
    // new Date().toISOString().substring(0, 10);
    return formatDate(jsDateObject, 'yyyy-MM-dd', 'en');
  }
  public static parseMonthYear(date) {

    if(date == null || date == undefined)
    {
      return {
        fromDate: null,
        toDate: null
      };
    }

    const year = date.getFullYear();
    const month = date.getMonth(); // 0-based

    const fromDate = new Date(year, month, 1);
    const toDate = new Date(year, month + 1, 0); // last day of the month

    // const fromDate = new Date(year, month, 1);
    // const toDate = new Date(year, month + 1, 0);

    // Format to ISO date string: YYYY-MM-DD
    const toISODate = (date) => date.toISOString().split("T")[0];

    return {
      fromDate: toISODate(fromDate),
      toDate: toISODate(toDate)
    };
  }

  public static  formatDateAsYYYYM(date: Date): string {
    const year = date.getFullYear(); // 4-digit year
    const month = date.getMonth() + 1; // 1-based month

    // Pad month with leading zero if needed
    const paddedMonth = month.toString().padStart(2, '0');

    return `${year}${paddedMonth}`;
  }
}

export class SystemUtils {
  public static checkInputValue(input: number): number {
    if (isNaN(input) || input <= 0) {
      return input = 1;
    }
    return input;
  }

  public static toNumber(input: number): number {
    if (isNaN(input) || input <= 0) {
      return input = 0;
    }
    return input;
  }

  public shortenTextInTable(text: string) {
    if (text == null || text == undefined) {
      return null;
    }

    if (text.length > 100) {
      text = text.substring(0, 100) + "...";
    }
    return text;
  }


  public static summariseDebitCredit(list: any[]): any {
    let summary: any = {};
    let credit: number = 0;
    let debit: number = 0;

    summary.debit = debit;
    summary.credit = credit;
    summary.difference = 0;

    if (list == null || list == undefined) {
      return summary;
    }


    list.forEach(item => {
      credit += item.credit;
      debit += item.debit;
    })

    summary.debit = debit;
    summary.credit = credit;
    summary.difference = credit - debit;
    summary.absoluteDiff = Math.abs(Math.abs(credit) - Math.abs(debit));
    return summary;
  }

  public static runningBalance(list: any[]): any {
    let balance = 0;
    if (list == null || list == undefined) {
      return list;
    }


    list.forEach(item => {
      balance += item.credit - Math.abs(item.debit);
      item.balance = balance;
    })
    return list;
  }
}

export class ObjectUtil {
  public static noValue(input): boolean {
    return !this.hasValue(input);
  }

  public static hasValue(input): boolean {
    if (input === undefined
      || input === 'undefined' || input === null || input === 'null' || input === '') {
      return false;
    }

    return true;
  }

  public static shortenText(text: string, length: number = 50) {
    try {
      if (text.length < length) return text;

      return text.substring(0, length) + "...";

    } catch (error) {
      return text;
    }
  }

  public static isValidNumber(value): boolean {
    if (ObjectUtil.noValue(value) || Number.isNaN(value)) {
      return false;
    }

    return true;
  }

  // public static isNullOrUndefined(value):boolean
  // {
  //   return !this.hasValue(value);
  // }

  public static isNullOrUndefined(value): boolean {
    // console.log("isNullOrUndefined value = ",value);
    if (value === null || value === undefined || value === 'null' || value === 'undefined') {
      return true;
    }
    return false;
  }

  public static isNullOrUndefinedOrEmpty(value): boolean {
    // console.log("isNullOrUndefined value = ",value);
    if (ObjectUtil.isNullOrUndefined(value) || value.trim() == "") {
      return true;
    }
    return false;
  }

  public static nullToFalse(value): boolean {
    if (this.isNullOrUndefined(value)) {
      return false;
    }

    return value;
  }

  public static booleanNullToFalse(data, field) {
    if (ObjectUtil.isNullOrUndefined(data[field]))
    {
      data[field] = false;
    }
  }

  public static generateUUID(): string { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if (d > 0) {//Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {//Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  public static getPaymentTypeLabel(value): string {
    if (!ObjectUtil.isNullOrUndefined(value)) {
      if (value == "INVOICE_PAYMENT") return "INVOICE PAYMENT";
      if (value == "BILL_PAYMENT") return "BILL PAYMENT";
    }
    return "";
  }

  public static toValue(input): any {
    if (ObjectUtil.hasValue(input)) {
      return input;
    }
    return null;
  }


  public static nullToZero(input): any {
    if (ObjectUtil.isValidNumber(input)) {
      return input;
    }
    return 0;
  }

  public static roundTo2dp(value): number {
    try {
      return Math.round((value + Number.EPSILON) * 100) / 100;
    } catch (error) {
      return 0;
    }
  }

  public static removeNull(item): any {
    Object.keys(item).forEach(key => {
      if (item[key] === null ||
        item[key] === undefined ||
        item[key] === 'null') {
        delete item[key];
      }
    });

    return item;
  }

  static displayName(user):string
  {
    if(ObjectUtil.isNullOrUndefined(user)) return "";

    if(!ObjectUtil.isNullOrUndefined(user.fullName))
    {
      return user.fullName;
    }

    if(!ObjectUtil.isNullOrUndefined(user.emailAddress))
    {
      return user.emailAddress;
    }

    return "";
  }

  static logInvalidFields(formGroup: UntypedFormGroup, parentKey: string = ''): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);

      if (control instanceof UntypedFormGroup) {
        // Recursively log nested FormGroups
        this.logInvalidFields(control, parentKey ? `${parentKey}.${key}` : key);
      } else if (control && control.invalid) {
        const controlPath = parentKey ? `${parentKey}.${key}` : key;
        console.warn(`Invalid Field: ${controlPath}`, control.errors);
      }
    });
  }


  /**
 * Examines a string for newline characters and standardizes them to Windows format (\r\n)
 * if they are currently only Unix format (\n).
 * * @param content The string content from the textbox.
 * @returns The standardized string content.
 */
  static standardizeNewlines(content: string): string {
      if (!content) {
          return '';
      }

      // 1. Check if the content contains the simple newline character (\n)
      if (content.includes('\n')) {

          // 2. Check if the content already contains the Windows newline sequence (\r\n)
          if (!content.includes('\r\n')) {

              // If it contains '\n' but NOT '\r\n', then replace all single '\n'
              // with the Windows standard '\r\n'. The 'g' flag ensures all occurrences are replaced.
              return content.replace(/\n/g, '\r\n');
          }
      }

      // If no '\n' was found, or if '\r\n' was already present, return the original content.
      return content;
  }

}
