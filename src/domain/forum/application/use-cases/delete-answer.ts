import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface DeleteAnswerUseCaseParams {
  answerId: string
  authorId: string
}

type DeleteAnswerUseCaseReponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseParams): Promise<DeleteAnswerUseCaseReponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.answersRepository.delete(answer)

    return right(null)
  }
}
