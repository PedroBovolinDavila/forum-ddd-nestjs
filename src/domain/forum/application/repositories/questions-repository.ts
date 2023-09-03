import { Question } from '../../enterprise/entities/question'
import { PaginationParams } from '@/core/repositories/pagination-params'

export interface QuestionsRepository {
  findBySlug(slug: string): Promise<Question | null>
  findById(id: string): Promise<Question | null>
  findManyRecent(params: PaginationParams): Promise<Question[]>
  create(question: Question): Promise<void>
  delete(question: Question): Promise<void>
  save(question: Question): Promise<void>
}
