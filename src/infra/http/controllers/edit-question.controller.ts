import { z } from 'zod'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(editQuestionBodySchema))
    body: EditQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ): Promise<void> {
    const { title, content, attachments } = body
    const { sub: userId } = user

    const result = await this.editQuestion.execute({
      title,
      content,
      authorId: userId,
      questionId,
      attachmentIds: attachments,
    })

    if (result.isLeft()) {
      const error = result.value

      console.log(error)

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        case NotAllowedError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
