import { z } from 'zod'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body
    const { sub: userId } = user

    const slug = this.createSlug(title)

    await this.prisma.question.create({
      data: {
        title,
        content,
        slug,
        authorId: userId,
      },
    })
  }

  private createSlug(title: string): string {
    const unaccentedString = title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    const slug = unaccentedString
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    return slug
  }
}
