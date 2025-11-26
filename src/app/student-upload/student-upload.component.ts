import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import {FormBuilder, UntypedFormGroup} from "@angular/forms";
import {StudentService} from "../student/student.service";
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-student-upload',
  standalone: true,
  imports: [CommonModule, CoreModule, TableModule],
  templateUrl: './student-upload.component.html'
})
export class StudentUploadComponent implements OnInit {

    studentService  = inject(StudentService);

    private fb = inject(FormBuilder);

  selectedFile: File | null = null;
  headers: string[] = [];
  preview: Array<Record<string, string>> = [];
  parseError: string | null = null;
   loading = false;

  // API response rendering
  apiHeaders: string[] = [];
  apiRows: any[] = [];
  saving = false;


    uploadForm: UntypedFormGroup;
    fileString: any;
    fileName: any;


    ngOnInit(): void {
        this.initUploadForm();
    }


    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    onFileChange(event) {
        const reader = new FileReader();

        if (event.target.files && event.target.files.length)
        {
            const [file] = event.target.files;
            if (file) {
                reader.readAsDataURL(file);
            }

            reader.onload = () => {
                // //console.log("reader.result == ",reader.result);
                this.fileString = reader.result;
            };

            //console.log("file.name == ", file.name);
            this.fileName = file.name;
        }
    }

    clearUploadForm()
    {
        this.uploadForm.reset();
        this.uploadForm.controls['selectedFile'].reset();
        this.fileName = null;
        this.fileString = null;
        // Also clear the native file input so the same file can be selected again
        if (this.fileInput && this.fileInput.nativeElement) {
            this.fileInput.nativeElement.value = '';
        }
    }



    public async upload()
    {
        try
        {
            this.loading = true;
            const uploadFile: any = {};

            uploadFile.fileName = this.fileName;
            uploadFile.fileString = this.fileString;

            // this.getFormValues(uploadFile);


            const result = await this.studentService.uploadStudent(uploadFile);
            if (result?.success) {
                const rows: any[] = Array.isArray(result.data) ? result.data : [];
                this.apiRows = result.data;
                this.apiHeaders = rows.length ? Object.keys(rows[0]) : [];
            } else {
                this.apiRows = [];
                this.apiHeaders = [];
            }
        } catch (error)
        {
            console.log("error uploading student data",error);
        } finally {
            this.loading = false;
            // Clear selected file after attempting upload to prevent duplicate re-uploads of the same file
            // this.clearUploadForm();
        }
    }





    onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;
    this.selectedFile = file;
    this.preview = [];
    this.headers = [];
    this.parseError = null;
    if (file) {
      // this.readAndPreview(file);
    }
  }


    initUploadForm() {
        this.uploadForm = this.fb.group({
            selectedFile: null,
        });
    }

  clearSelection(): void {
    this.selectedFile = null;
    this.preview = [];
    this.headers = [];
    this.parseError = null;
  }

  async processFile(): Promise<void> {
    // Placeholder for future upload to backend
    alert('Processing file... (This is a preview-only implementation)');
  }

  async processAndSave(): Promise<void> {
    if (!this.apiRows?.length || this.saving) {
      return;
    }
    try {
      this.saving = true;
      const resp = await this.studentService.saveUpload(this.apiRows);

    } catch (e) {
      console.error('Error saving upload', e);
      // alert('An unexpected error occurred while saving.');
    } finally {
      this.saving = false;
    }
  }

  // private readAndPreview(file: File): void {
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     try {
  //       const text = String(reader.result || '');
  //       const { headers, rows } = this.parseCsv(text);
  //       this.headers = headers;
  //       this.preview = rows.slice(0, 50); // show up to 50 rows
  //     } catch (e: any) {
  //       this.parseError = e?.message || 'Failed to parse CSV file';
  //     }
  //   };
  //   reader.onerror = () => {
  //     this.parseError = 'Could not read the selected file';
  //   };
  //   reader.readAsText(file);
  // }

  // // Very lightweight CSV parser (handles quoted values and commas inside quotes)
  // private parseCsv(text: string): { headers: string[]; rows: Array<Record<string, string>> } {
  //   const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
  //   if (!lines.length) {
  //     return { headers: [], rows: [] };
  //   }
  //   const headers = this.splitCsvLine(lines[0]);
  //   const rows: Array<Record<string, string>> = [];
  //   for (let i = 1; i < lines.length; i++) {
  //     const cols = this.splitCsvLine(lines[i]);
  //     const rec: Record<string, string> = {};
  //     headers.forEach((h, idx) => {
  //       rec[h] = (cols[idx] ?? '').trim();
  //     });
  //     rows.push(rec);
  //   }
  //   return { headers, rows };
  // }

  // private splitCsvLine(line: string): string[] {
  //   const result: string[] = [];
  //   let current = '';
  //   let inQuotes = false;
  //   for (let i = 0; i < line.length; i++) {
  //     const ch = line[i];
  //     if (ch === '"') {
  //       if (inQuotes && line[i + 1] === '"') {
  //         current += '"';
  //         i++; // skip escaped quote
  //       } else {
  //         inQuotes = !inQuotes;
  //       }
  //     } else if (ch === ',' && !inQuotes) {
  //       result.push(current);
  //       current = '';
  //     } else {
  //       current += ch;
  //     }
  //   }
  //   result.push(current);
  //   return result;
  // }
}
