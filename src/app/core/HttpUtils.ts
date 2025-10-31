
export class HttpUtils
{
    listView:boolean = false;
    createView:boolean = false;
    detailView:boolean = false;

    public static toUrlParam(jsonobject):string
    {
      Object.keys(jsonobject).forEach(key => {
        if (jsonobject[key] === null ||
          jsonobject[key] === undefined ||
         jsonobject[key] === 'null') {
          delete jsonobject[key];
        }
      });

      return new URLSearchParams(jsonobject).toString()
    }

}
