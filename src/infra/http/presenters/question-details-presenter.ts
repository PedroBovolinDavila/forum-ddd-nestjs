import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'

export class QuestionDetailsPresenter {
  static toHTTP(questionDetails: QuestionDetails) {
    return {
      questionId: questionDetails.questionId.toString(),
      authorId: questionDetails.authorId.toString(),
      bestAnswerId: questionDetails.bestAnswerId?.toString(),
      attachments: questionDetails.attachments,
      author: {
        id: questionDetails.authorId.toString(),
        name: questionDetails.authorName,
      },
      title: questionDetails.title,
      slug: questionDetails.slug.value,
      content: questionDetails.content,
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
    }
  }
}
