import { Either, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotificationsRepository } from '../repositories/notifications-repository'

export interface SendNotificationUseCaseParams {
  recipientId: string
  title: string
  content: string
}

export type SendNotificationUseCaseReponse = Either<
  null,
  { notification: Notification }
>

export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    title,
    content,
    recipientId,
  }: SendNotificationUseCaseParams): Promise<SendNotificationUseCaseReponse> {
    const notification = Notification.create({
      title,
      content,
      recipientId: new UniqueEntityID(recipientId),
    })

    await this.notificationsRepository.create(notification)

    return right({
      notification,
    })
  }
}
