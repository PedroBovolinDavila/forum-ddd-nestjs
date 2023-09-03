import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { PaginationParams } from '@/core/repositories/pagination-params'

export interface AnswerCommentsRepository {
  create(answerComment: AnswerComment): Promise<void>
  delete(answerComment: AnswerComment): Promise<void>
  findById(id: string): Promise<AnswerComment | null>
  findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>
}
