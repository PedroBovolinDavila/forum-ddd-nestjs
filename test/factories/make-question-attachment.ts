import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeQuestionAttachment(
  override: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const questionAttachment = QuestionAttachment.create(
    {
      questionId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return questionAttachment
}

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionAttachment(
    data: Partial<QuestionAttachmentProps> = {},
  ): Promise<QuestionAttachment> {
    const questionattachment = makeQuestionAttachment(data)

    await this.prisma.attachment.update({
      where: {
        id: questionattachment.attachmentId.toString(),
      },
      data: {
        questionId: questionattachment.questionId.toString(),
      },
    })

    return questionattachment
  }
}
