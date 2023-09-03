import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { QuestionsRepository } from '../repositories/questions-repository'
import { QuestionAttachmentsRepository } from '../repositories/question-atachments-repository'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface EditQuestionUseCaseParams {
  authorId: string
  questionId: string
  title: string
  content: string
  attachmentIds: string[]
}

type EditQuestionUseCaseReponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    questionId,
    authorId,
    title,
    content,
    attachmentIds,
  }: EditQuestionUseCaseParams): Promise<EditQuestionUseCaseReponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId)
    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    )

    const questionAttachments = attachmentIds.map((id) => {
      return QuestionAttachment.create({
        questionId: question.id,
        attachmentId: new UniqueEntityID(id),
      })
    })

    questionAttachmentList.update(questionAttachments)

    question.attachments = questionAttachmentList
    question.title = title
    question.content = content

    await this.questionsRepository.save(question)

    return right(null)
  }
}
