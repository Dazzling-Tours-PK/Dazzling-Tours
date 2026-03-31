export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface UploadResponse {
  success: boolean;
  data: UploadResult[];
  count: number;
}
