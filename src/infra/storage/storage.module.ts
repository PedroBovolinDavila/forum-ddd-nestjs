import { Uploader } from '@/domain/forum/application/storage/uploader'
import { Module } from '@nestjs/common'
import { CloudinaryUploader } from './cloudinary-uploader'
import { EnvModule } from '../env/env.module'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: CloudinaryUploader,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
