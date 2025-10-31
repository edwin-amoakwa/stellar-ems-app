import { ClipboardModule } from "@angular/cdk/clipboard";
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from "primeng/badge";
import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from "primeng/carousel";
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from "primeng/divider";
import { EditorModule } from 'primeng/editor';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { PanelModule } from 'primeng/panel';
import { PopoverModule } from 'primeng/popover';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from "primeng/radiobutton";
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { SplitButtonModule } from "primeng/splitbutton";
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { ChipModule } from 'primeng/chip';
// import { TabViewModule } from 'primeng/tabview';
import { DatePickerModule } from 'primeng/datepicker';
import { PasswordModule } from 'primeng/password';
import { SelectButton } from 'primeng/selectbutton';
import { TextareaModule } from 'primeng/textarea';
import { TimelineModule } from 'primeng/timeline';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
import { ListboxModule } from 'primeng/listbox';
import {ConfirmDialog, ConfirmDialogModule} from 'primeng/confirmdialog';




// project import

// third party
import { NgScrollbarModule } from 'ngx-scrollbar';

// bootstrap import
import { NgbDropdownModule, NgbNavModule, NgbModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import {CardComponent} from '../theme/shared/components/card/card.component';
import {TagModule} from 'primeng/tag';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    TooltipModule,
    TextareaModule,
    SelectModule,
    PanelModule,
    DialogModule,
    CardModule,
    CheckboxModule,
    RadioButtonModule,
    InputNumberModule,
    SplitButtonModule,
    InputMaskModule,
    EditorModule,
    BadgeModule,
    OverlayBadgeModule,
    PopoverModule,
    DividerModule,
    DatePickerModule,
    // TabViewModule,
    ToggleSwitchModule,
    SelectButton,
    TimelineModule,
    ToolbarModule,
    AccordionModule,
    SliderModule,
    ContextMenuModule,
    ConfirmPopupModule,
    MultiSelectModule,
    InputGroupModule,
    InputGroupAddonModule,
    IconFieldModule,
    InputIconModule,
    TabsModule,
    ProgressSpinnerModule,
    CarouselModule,
    ChartModule,
    FloatLabelModule,
    ChipModule,
    FileUploadModule,
  BlockUIModule,
    RouterLink,
    RouterOutlet,
    ToastrModule.forRoot(),
    ClipboardModule,
    ListboxModule,
    TagModule,
    ConfirmPopupModule,
    DialogModule,
    ConfirmDialog,
    ConfirmDialogModule,

    CardComponent,
    NgbDropdownModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbModule,
    NgbCollapseModule,
    NgScrollbarModule
  ],
  exports:[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SplitButtonModule,
    DividerModule,
    TableModule,
    ButtonModule,
    BlockUIModule,
    InputTextModule,
    PasswordModule,
    TooltipModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    BadgeModule,
    OverlayBadgeModule,
    PopoverModule,
    DialogModule,
    PanelModule,
    CardModule,
    CheckboxModule,
    InputNumberModule,
    InputMaskModule,
    EditorModule,
    DatePickerModule,
    // TabViewModule,
    ToggleSwitchModule,
    SelectButton,
    ToolbarModule,
    TimelineModule,
    AccordionModule,
    SliderModule,
    ContextMenuModule,
    ConfirmPopupModule,
    MultiSelectModule,
    InputGroupModule,
    InputGroupAddonModule ,
    IconFieldModule,
    InputIconModule,
    TabsModule,
    ProgressSpinnerModule,
    FloatLabelModule,
     CarouselModule,
     ChartModule,
    FileUploadModule,
    ChipModule,
    RouterLink,
    RouterOutlet,
    ListboxModule,
    TagModule,

    ConfirmPopupModule,
    DialogModule,
    ConfirmDialog,
    ConfirmDialogModule,


    CardComponent,
    NgbDropdownModule,
    NgbNavModule,
    NgbModule,
    NgbCollapseModule,
    NgScrollbarModule
  ]
})
export class CoreModule { }
