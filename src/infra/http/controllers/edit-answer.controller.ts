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
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

const editAnswerBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(editAnswerBodySchema))
    body: EditAnswerBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') answerId: string,
  ): Promise<void> {
    const { content, attachments } = body
    const { sub: userId } = user

    const result = await this.editAnswer.execute({
      answerId,
      authorId: userId,
      content,
      attachmentIds: attachments,
    })

    if (result.isLeft()) {
      const error = result.value

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
