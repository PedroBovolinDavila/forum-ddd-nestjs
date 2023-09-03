import { Env } from '@/infra/env'
import { JwtModule } from '@nestjs/jwt'
import { Module } from '@nestjs/common'
import { JwtStrategy } from './jwt.strategy'
import { ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (config: ConfigService<Env, true>) => {
        const privateKey = config.get('JWT_PRIVATE_KEY', { infer: true })
        const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

        return {
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
          signOptions: {
            algorithm: 'RS256',
          },
        }
      },
    }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
