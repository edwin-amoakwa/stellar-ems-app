
export class FormView
{
    listView:boolean = false;
    createView:boolean = false;
    detailView:boolean = false;

    public static listView():FormView
    {
        let formView:FormView = new FormView();
        formView.listView = true;

        return formView;
    }

    public close()
    {
        this.listView = false;
        this.createView = false;
        this.detailView = false;
    }

    public resetToListView()
    {
        this.close();
        this.listView = true;
    }

    public resetToCreateView()
    {
        this.close();
        this.createView = true;
    }

    public resetToDetailView()
    {
        this.close();
        this.detailView = true;
    }
}