import { expect, describe, it, beforeEach } from 'vitest'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete AnswerComment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to delete a answer comment', async () => {
    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-comment-1'),
    )

    await inMemoryAnswerCommentsRepository.create(newAnswerComment)

    await sut.execute({
      answerCommentId: 'answer-comment-1',
      authorId: 'author-1',
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer comment from another user', async () => {
    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-comment-1'),
    )

    await inMemoryAnswerCommentsRepository.create(newAnswerComment)

    const result = await sut.execute({
      answerCommentId: 'answer-comment-1',
      authorId: 'author-2',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
