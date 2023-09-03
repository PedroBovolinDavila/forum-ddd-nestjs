import { Either, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

interface FetchRecentQuestionsUseCaseParams {
  page: number
}

type FetchRecentQuestionsUseCaseReponse = Either<
  null,
  { questions: Question[] }
>

export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseParams): Promise<FetchRecentQuestionsUseCaseReponse> {
    const questions = await this.questionsRepository.findManyRecent({
      page,
    })

    return right({
      questions,
    })
  }
}
