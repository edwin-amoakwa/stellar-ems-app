
export class Pager
{
    pageNo:number = 1;
    pageSize:number = 10;
    totalRecords:number = 0;

    public static createPagerNg(data:any)
    {
        let searchParam:any = {};
        // console.log("pager-data",data);
        if(data.rows <= 0)
        {
          searchParam.pageSize = data.rows;
          return searchParam;
        }

        searchParam.pageNo =  (data.first / data.rows) + 1;
        searchParam.pageSize = data.rows;

        return searchParam;
    }
}

