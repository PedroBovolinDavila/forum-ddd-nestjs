import { makeAnswer } from 'test/factories/make-answer'
import { expect, describe, it, beforeEach } from 'vitest'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryAnswerRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Recent Answer Comments', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const answer = makeAnswer()
    await inMemoryAnswerRepository.create(answer)

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: answer.id,
      }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: answer.id,
      }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: answer.id,
      }),
    )

    const result = await sut.execute({
      answerId: answer.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should be able to fetch paginated answer comments', async () => {
    const answer = makeAnswer()
    await inMemoryAnswerRepository.create(answer)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: answer.id,
        }),
      )
    }

    const result = await sut.execute({
      answerId: answer.id.toString(),
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toHaveLength(2)
  })
})
