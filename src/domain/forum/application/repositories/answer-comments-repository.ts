import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

export abstract class AnswerCommentsRepository {
  abstract create(answerComment: AnswerComment): Promise<void>
  abstract delete(answerComment: AnswerComment): Promise<void>
  abstract findById(id: string): Promise<AnswerComment | null>
  abstract findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>

  abstract findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]>
}
