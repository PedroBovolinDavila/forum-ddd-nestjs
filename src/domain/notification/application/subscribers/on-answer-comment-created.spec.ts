import { SpyInstance, beforeEach, describe, expect, it, vi } from 'vitest'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseParams,
  SendNotificationUseCaseReponse,
} from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { makeQuestion } from 'test/factories/make-question'
import { waitFor } from 'test/utils/wait-for'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { OnAnswerCommentCreated } from './on-answer-comment-created'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseParams],
  Promise<SendNotificationUseCaseReponse>
>

describe('On Answer Comment Created', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnAnswerCommentCreated(
      inMemoryAnswersRepository,
      sendNotificationUseCase,
    )
  })

  it('should be able to send a notification when an answer comment is created', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({
      questionId: question.id,
    })
    const answerComment = makeAnswerComment({
      answerId: answer.id,
    })

    inMemoryQuestionsRepository.create(question)
    inMemoryAnswersRepository.create(answer)
    inMemoryAnswerCommentsRepository.create(answerComment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
