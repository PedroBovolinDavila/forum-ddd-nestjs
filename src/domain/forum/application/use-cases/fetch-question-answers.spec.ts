import { makeAnswer } from 'test/factories/make-answer'
import { expect, describe, it, beforeEach } from 'vitest'
import { makeQuestion } from 'test/factories/make-question'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch question answers', async () => {
    const question = makeQuestion()

    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: question.id,
      }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: question.id,
      }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: question.id,
      }),
    )

    const result = await sut.execute({
      page: 1,
      questionId: question.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(3)
  })

  it('should be able to fetch paginated questions', async () => {
    const question = makeQuestion()

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: question.id,
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
      questionId: question.id.toValue(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(2)
  })
})
