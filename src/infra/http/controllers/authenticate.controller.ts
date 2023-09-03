import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { compare } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new UnauthorizedException('Wrong credentials')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong credentials')
    }

    const accessToken = this.jwt.sign({
      sub: user.id,
    })

    return {
      accessToken,
    }
  }
}
