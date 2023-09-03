import { Question } from '@/domain/forum/enterprise/entities/question'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-atachments-repository'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async create(question: Question) {
    this.items.push(question)
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id.toString() === id)

    if (!question) {
      return null
    }

    return question
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return questions
  }

  async delete(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items.splice(itemIndex, 1)

    await this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }

  async save(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items[itemIndex] = question

    DomainEvents.dispatchEventsForAggregate(question.id)
  }
}
