import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = []

  async create(questionComment: QuestionComment): Promise<void> {
    this.items.push(questionComment)
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const questionCommentIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    )

    this.items.splice(questionCommentIndex, 1)
  }

  async findById(id: string): Promise<null | QuestionComment> {
    const questionComment = this.items.find((item) => item.id.toString() === id)

    if (!questionComment) {
      return null
    }

    return questionComment
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionComments = this.items
      .filter((item) => item.questionId.toValue() === questionId)
      .splice((page - 1) * 20, page * 20)

    return questionComments
  }
}
