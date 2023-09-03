import { expect, describe, it, beforeEach } from 'vitest'
import { makeQuestion } from 'test/factories/make-question'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Recent Question Comments', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    const question = makeQuestion()
    await inMemoryQuestionRepository.create(question)

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: question.id,
      }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: question.id,
      }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: question.id,
      }),
    )

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(3)
  })

  it('should be able to fetch paginated question comments', async () => {
    const question = makeQuestion()
    await inMemoryQuestionRepository.create(question)

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: question.id,
        }),
      )
    }

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(2)
  })
})
