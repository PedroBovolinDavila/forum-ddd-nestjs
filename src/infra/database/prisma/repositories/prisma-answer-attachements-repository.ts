import { Injectable } from '@nestjs/common'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper'

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const attachments = await this.prisma.attachment.findMany({
      where: {
        answerId,
      },
    })

    return attachments.map((attachment) =>
      PrismaAnswerAttachmentMapper.toDomain(attachment),
    )
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        answerId,
      },
    })
  }

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const data =
      PrismaAnswerAttachmentMapper.toPersistanceUpdateMany(attachments)

    await this.prisma.attachment.updateMany(data)
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const attachmentsIds = attachments.map((attachment) =>
      attachment.id.toString(),
    )

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentsIds,
        },
      },
    })
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        questionId,
      },
    })
  }
}
