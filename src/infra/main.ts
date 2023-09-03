import { Env } from './env'
import { AppModule } from './app.module'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = app.get<ConfigService<Env, true>>(ConfigService)
  const port = config.get('PORT', { infer: true })

  await app.listen(port)
}

bootstrap()
