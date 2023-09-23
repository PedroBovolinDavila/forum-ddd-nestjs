import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Comment as PrismaComment, Prisma } from '@prisma/client'

export class PrismaQuestionCommentMapper {
  static toDomain(raw: PrismaComment): QuestionComment {
    if (!raw.questionId) {
      throw new Error('Invalid comment type.')
    }

    return QuestionComment.create(
      {
        authorId: new UniqueEntityID(raw.authorId),
        questionId: new UniqueEntityID(raw.questionId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        content: raw.content,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistence(
    questionComment: QuestionComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      authorId: questionComment.authorId.toString(),
      questionId: questionComment.questionId.toString(),
      id: questionComment.id.toString(),
      createdAt: questionComment.createdAt,
      updatedAt: questionComment.updatedAt,
      content: questionComment.content,
    }
  }
}
