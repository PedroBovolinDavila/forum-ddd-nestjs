import {
  UploadParams,
  Uploader,
} from '@/domain/forum/application/storage/uploader'
import { v2 as cloudinary } from 'cloudinary'
import { EnvService } from '../env/env.service'
import { Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'

@Injectable()
export class CloudinaryUploader implements Uploader {
  constructor(envService: EnvService) {
    cloudinary.config({
      cloud_name: envService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: envService.get('CLOUDINARY_API_KEY'),
      api_secret: envService.get('CLOUDINARY_API_SECRET'),
      secure: true,
    })
  }

  async upload({ fileName, filePath }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      use_filename: true,
      discard_original_filename: true,
      filename_override: uniqueFileName,
    })

    const url = `${uploadResult.public_id}.${uploadResult.type}`

    return {
      url,
    }
  }
}
