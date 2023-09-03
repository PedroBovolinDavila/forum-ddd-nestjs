import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { AnswerCommentCreated } from '@/domain/forum/enterprise/events/answer-comment-created'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNoficationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendAnswerCommentNotification.bind(this),
      AnswerCommentCreated.name,
    )
  }

  private async sendAnswerCommentNotification({
    answerComment,
  }: AnswerCommentCreated) {
    const answer = await this.answersRepository.findById(
      answerComment.answerId.toString(),
    )

    if (answer) {
      await this.sendNoficationUseCase.execute({
        recipientId: answer.id.toString(),
        title: `Novo comentário em sua resposta!`,
        content: answerComment.content.substring(0, 120).concat('...'),
      })
    }
  }
}
