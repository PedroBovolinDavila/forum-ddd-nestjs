export interface UploadParams {
  fileName: string
  filePath: string
}

export abstract class Uploader {
  abstract upload(params: UploadParams): Promise<{ url: string }>
}
