import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, inject } from '@angular/core';
import { CoreModule } from '../../core/core.module';
import { MessageBox } from '../../message-helper';
import {PictureService} from "../../picture.service";

@Component({
  selector: 'app-device-capture',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './device-capture.component.html',
  styleUrls: ['./device-capture.component.scss']
})
export class DeviceCaptureComponent implements OnInit, OnDestroy {
  private generalService = inject(PictureService);

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() student: any = null;
  @Output() saved = new EventEmitter<{ studentId: string; imageBase64: string }>();

  // Camera/Capture
  @ViewChild('video') videoRef?: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasRef?: ElementRef<HTMLCanvasElement>;
  private mediaStream: MediaStream | null = null;
  cameraActive = false;
  captured = false;
  private capturedImage?: HTMLImageElement;

  // Crop state
  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private currentX = 0;
  private currentY = 0;
  hasCrop = false;
  previewDataUrl: string | null = null;

  saving = false;
  saveError: string | null = null;

  ngOnInit(): void {
    if (this.visible) {
      setTimeout(() => this.loadExistingOrStartCamera(), 0);
    }
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  // Visibility control from parent
  onHideDialog() {
    this.cleanupState();
    this.visible = false;
    this.visibleChange.emit(false);
  }

  // Camera controls
  async startCamera() {
    if (this.cameraActive) return;
    try {
      const constraints: MediaStreamConstraints = { video: { facingMode: 'user' }, audio: false };
      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      const video = this.videoRef?.nativeElement;
      if (video && this.mediaStream) {
        (video as any).srcObject = this.mediaStream as any;
        await video.play();
        this.cameraActive = true;
      }
    } catch (e) {
      console.error('Camera start failed', e);
      this.saveError = 'Unable to access camera. Please grant permission or use a supported device.';
    }
  }

  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
    }
    this.mediaStream = null;
    this.cameraActive = false;
  }

  captureFrame() {
      console.log('Capture frame');
    const video = this.videoRef?.nativeElement;
    // Note: the display <canvas> is only rendered when `captured` is true (via *ngIf).
    // During capture, that canvas does not exist yet, so use an offscreen canvas instead.
    if (!video) {
      console.log('Capture frame failed - no video element');
      return;
    }
    const width = video.videoWidth;
    const height = video.videoHeight;
    console.log('Capture frame', width, height);
    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = offscreen.toDataURL('image/png');
    const img = new Image();
    img.onload = () => {
      this.capturedImage = img;
      this.captured = true;
      this.hasCrop = false;
      this.previewDataUrl = null;
      // Defer redraw until the template canvas is present in the DOM
      setTimeout(() => this.redrawCanvas());
      this.stopCamera();
    };
    img.src = dataUrl;
  }

  retake() {
    this.captured = false;
    this.capturedImage = undefined;
    this.previewDataUrl = null;
    this.hasCrop = false;
    this.startCamera();
  }

  private getCanvasCoords(event: MouseEvent) {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return { x: 0, y: 0 } as const;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y } as const;
  }

  onCanvasMouseDown(event: MouseEvent) {
    if (!this.captured) return;
    this.isDragging = true;
    const { x, y } = this.getCanvasCoords(event);
    this.startX = this.currentX = x;
    this.startY = this.currentY = y;
  }

  onCanvasMouseMove(event: MouseEvent) {
    if (!this.isDragging || !this.captured) return;
    const { x, y } = this.getCanvasCoords(event);
    this.currentX = x;
    this.currentY = y;
    this.redrawCanvas();
  }

  onCanvasMouseUp() {
    if (!this.captured) return;
    this.isDragging = false;
    const w = Math.abs(this.currentX - this.startX);
    const h = Math.abs(this.currentY - this.startY);
    this.hasCrop = w > 10 && h > 10;
  }

  private redrawCanvas() {
    const canvas = this.canvasRef?.nativeElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !this.capturedImage) return;
    canvas.width = this.capturedImage.width;
    canvas.height = this.capturedImage.height;
    ctx.drawImage(this.capturedImage, 0, 0);
    if (this.isDragging || this.hasCrop) {
      const x = Math.min(this.startX, this.currentX);
      const y = Math.min(this.startY, this.currentY);
      const w = Math.abs(this.currentX - this.startX);
      const h = Math.abs(this.currentY - this.startY);
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.clearRect(x, y, w, h);
      ctx.strokeStyle = '#00d1b2';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);
      ctx.restore();
    }
  }

  previewCrop() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas || !this.capturedImage || !this.hasCrop) return;
    const x = Math.min(this.startX, this.currentX);
    const y = Math.min(this.startY, this.currentY);
    const w = Math.abs(this.currentX - this.startX);
    const h = Math.abs(this.currentY - this.startY);

    const off = document.createElement('canvas');
    off.width = w;
    off.height = h;
    const offCtx = off.getContext('2d');
    if (!offCtx) return;
    offCtx.drawImage(this.capturedImage, x, y, w, h, 0, 0, w, h);
    this.previewDataUrl = off.toDataURL('image/png');
  }

  async saveCroppedImage() {
    if (!this.student) return;
    try {
      this.saving = true;
      this.saveError = null;

      let base64: string | null = null;

      if (this.hasCrop) {
        // If a crop is selected, ensure we have a preview (cropped) data URL
        if (!this.previewDataUrl) {
          this.previewCrop();
        }
        base64 = this.previewDataUrl;
      } else {
        // Cropping is optional: if no crop, save the full captured frame
        if (this.capturedImage) {
          const off = document.createElement('canvas');
          off.width = this.capturedImage.width;
          off.height = this.capturedImage.height;
          const offCtx = off.getContext('2d');
          if (offCtx) {
            offCtx.drawImage(this.capturedImage, 0, 0);
            base64 = off.toDataURL('image/png');
          }
        }
      }

      if (!base64) {
        this.saveError = 'Please capture an image before saving.';
        return;
      }

      const pictureData:any = {};

      pictureData.relatedEntityId = this.student.relatedEntityId;
      pictureData.relatedEntity = 'STUDENT';
      pictureData.pictureBase64 = base64;
      pictureData.pictureFormat = 'image/png';

      // console.log(pictureData);

      const resp = await this.generalService.savePicture( pictureData);

        pictureData.id = this.student.relatedEntityId;

      if (resp?.success) {
        MessageBox.success(resp?.message || 'Picture saved');
        this.saved.emit(pictureData);
        this.onHideDialog();
      } else {
        this.saveError = resp?.message || 'Failed to save picture';
      }
    } catch (e: any) {
      console.error('Save picture failed', e);
      this.saveError = e?.error?.message || e?.message || 'Failed to save picture';
    } finally {
      this.saving = false;
    }
  }

  // Called by parent to open and prep camera
  onOpened() {
    setTimeout(() => this.loadExistingOrStartCamera(), 0);
  }

  private cleanupState() {
    this.stopCamera();
    this.captured = false;
    this.capturedImage = undefined;
    this.previewDataUrl = null;
    this.hasCrop = false;
    this.saveError = null;
  }

  private async loadExistingOrStartCamera() {
    // If a student is provided, try to fetch an existing picture; otherwise start camera.
    if (!this.student?.id) {
      await this.startCamera();
      return;
    }

    try {
      const resp: any = await this.generalService.getPictureByStudentId(this.student.id);
      const base64: string | null = resp?.data?.pictureBase64 || null;
      if (resp?.success && base64) {
        const img = new Image();
        img.onload = () => {
          this.capturedImage = img;
          this.captured = true;
          this.hasCrop = false;
          this.previewDataUrl = null;
          // Ensure canvas exists then draw
          setTimeout(() => this.redrawCanvas());
          this.stopCamera();
        };
        img.src = base64;
        return;
      }
    } catch (e) {
      // ignore and fallback to camera
    }
    await this.startCamera();
  }
}
