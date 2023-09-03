import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface EditAnswerUseCaseParams {
  authorId: string
  answerId: string
  content: string
  attachmentIds: string[]
}

type EditAnswerUseCaseReponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    answerId,
    authorId,
    content,
    attachmentIds,
  }: EditAnswerUseCaseParams): Promise<EditAnswerUseCaseReponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId)
    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    )

    const answerAttachments = attachmentIds.map((id) => {
      return AnswerAttachment.create({
        answerId: answer.id,
        attachmentId: new UniqueEntityID(id),
      })
    })

    answerAttachmentList.update(answerAttachments)

    answer.attachments = answerAttachmentList
    answer.content = content

    await this.answersRepository.save(answer)

    return right(null)
  }
}
