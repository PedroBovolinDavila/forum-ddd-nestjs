import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Comment as PrismaComment, Prisma } from '@prisma/client'

export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaComment): AnswerComment {
    if (!raw.answerId) {
      throw new Error('Invalid comment type.')
    }

    return AnswerComment.create(
      {
        authorId: new UniqueEntityID(raw.authorId),
        answerId: new UniqueEntityID(raw.answerId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        content: raw.content,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistence(
    answerComment: AnswerComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      authorId: answerComment.authorId.toString(),
      answerId: answerComment.answerId.toString(),
      id: answerComment.id.toString(),
      createdAt: answerComment.createdAt,
      updatedAt: answerComment.updatedAt,
      content: answerComment.content,
    }
  }
}
