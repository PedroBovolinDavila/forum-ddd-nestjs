import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Question } from '../../enterprise/entities/question'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { QuestionsRepository } from '../repositories/questions-repository'

interface ChooseQuestionBestAnswerUseCaseParams {
  answerId: string
  authorId: string
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseParams): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found')
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.toValue(),
    )

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toValue()) {
      return left(new NotAllowedError())
    }

    question.bestAnswerId = answer.id

    await this.questionsRepository.save(question)

    return right({
      question,
    })
  }
}
