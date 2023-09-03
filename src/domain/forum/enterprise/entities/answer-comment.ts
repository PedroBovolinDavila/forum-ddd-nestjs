import { Optional } from '@/core/types/optional'
import { Comment, CommentProps } from './comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerCommentCreated } from '../events/answer-comment-created'

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityID
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId() {
    return this.props.answerId
  }

  static create(
    props: Optional<AnswerCommentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    const isNew = !id

    if (isNew) {
      answerComment.addDomainEvent(new AnswerCommentCreated(answerComment))
    }

    return answerComment
  }
}
