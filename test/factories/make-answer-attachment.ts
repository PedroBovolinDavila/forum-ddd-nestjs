import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeAnswerAttachment(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const answerAttachment = AnswerAttachment.create(
    {
      answerId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return answerAttachment
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerAttachment(
    data: Partial<AnswerAttachmentProps> = {},
  ): Promise<AnswerAttachment> {
    const answerattachment = makeAnswerAttachment(data)

    await this.prisma.attachment.update({
      where: {
        id: answerattachment.attachmentId.toString(),
      },
      data: {
        answerId: answerattachment.answerId.toString(),
      },
    })

    return answerattachment
  }
}
