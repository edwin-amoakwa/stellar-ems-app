import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class StaticDataService {


  public static formsOfPayment():any[]
  {
    const data = [
      { id: 'BANK_TRANSFER', itemName: 'Bank Transfer' },
      { id: 'MTN_MOBILE_MONEY', itemName: 'MTN Mobile Money' },
      { id: 'CASH', itemName: 'Cash' },
      { id: 'CARD_PAYMENT', itemName: 'Card Payment' },
      { id: 'AT_CASH', itemName: 'AT Cash' },
      { id: 'VODAFON_CASH', itemName: 'Vodafon Cash' },
    ];

    return data;
  }

  public static accountCategories():any[]
  {
    const data = [
      { id: 'ADMIN', itemName: 'Administrator' },
      { id: 'VIEWER', itemName: 'Viewer' },
    ];

    return data;
  }

  public static accountStatuses():any[]
  {
    let data = [
      { id: 'ACTIVE', itemName: 'Active' },
      { id: 'INACTIVE', itemName: 'Inactive' }
    ];

    return data;
  }



  public static groupTypes():any[]
  {
   return [
      { id: 'FREE_FORM', itemName: 'Free Form' },
      { id: 'CONTACT_BASED', itemName: 'Contact Based' },
    ];
  }

  public static smsNature():any[]
  {
   return [
      { id: 'ONE_TIME', itemName: 'Onetime' },
      { id: 'RECURRING', itemName: 'Recurring' },
    ];
  }

  public static PhoneNumbersSources():any[]
  {
   return [
      { id: 'COPY_PASTE', itemName: 'Copy and Paste' },
      { id: 'UPLOADED_FILE', itemName: 'Uploaded File' },
      { id: 'GROUP', itemName: 'Group' },
    ];
  }


  public static relationsList(): any[] {
    return [
      { id: 'FATHER', itemName: 'Father' },
      { id: 'MOTHER', itemName: 'Mother' },
      { id: 'FAMILY_MEMBER', itemName: 'Family Member' },
    ];
  }

    public static religion(): any[] {
        return [
            { id: 'CHRISTIAN', itemName: 'Christian' },
            { id: 'MOSLEM', itemName: 'Moslem' },
            { id: 'TRADITIONALIST', itemName: 'Traditionalist' },
            { id: 'OTHER', itemName: 'Other' },
        ];
    }


    public static gender(): any[] {
        return [
            { id: 'MALE', itemName: 'Male' },
            { id: 'FEMALE', itemName: 'Female' }
        ];
    }

    public static educationLevels(): any[] {
        return [
            { id: 'DAY_CARE', itemName: 'Day Care' },
            { id: 'PRE_SCHOOL', itemName: 'Pre School' },
            { id: 'PRIMARY', itemName: 'Primary School' },
            { id: 'UPPER_PRIMARY', itemName: 'Upper Primary' },
            { id: 'LOWER_PRIMARY', itemName: 'Lower Primary' },
            { id: 'JHS', itemName: 'Junior High School' },
            { id: 'SHS', itemName: 'Senior High School' }
        ];
    }

    public static regions(): any[] {
        return [
            { id: 'GREATER_ACCRA', itemName: 'Greater Accra Region' },
            { id: 'CENTRAL_REGION', itemName: 'Central Region' },
            { id: 'ASHANTI_REGION', itemName: 'Ashanti Region' },
            { id: 'BONO_REGION', itemName: 'Bono Region' },
            { id: 'BONO_EAST_REGION', itemName: 'Bono East Region' },
            { id: 'AHAFO_REGION', itemName: 'Ahafo Region' },
            { id: 'NORTHERN_REGION', itemName: 'Northern Region' },
            { id: 'NORTH_EAST_REGION', itemName: 'North East Region' },
            { id: 'SAVANNAH_REGION', itemName: 'Savannah Region' },
            { id: 'UPPER_EAST_REGION', itemName: 'Upper East Region' },
            { id: 'UPPER_WEST_REGION', itemName: 'Upper West Region' },
            { id: 'EASTERN_REGION', itemName: 'Eastern Region' },
            { id: 'WESTERN_REGION', itemName: 'Western Region' },
            { id: 'WESTERN_NORTH_REGION', itemName: 'Western North Region' },
            { id: 'OTI_REGION', itemName: 'Oti Region' },
            { id: 'VOLTA_REGION', itemName: 'Volta Region' },
        ];
    }

}
