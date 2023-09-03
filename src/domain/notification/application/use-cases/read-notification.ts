import { Either, left, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface ReadNotificationUseCaseParams {
  notificationId: string
  recipientId: string
}

type ReadNotificationUseCaseReponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { notification: Notification }
>

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseParams): Promise<ReadNotificationUseCaseReponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId)

    if (!notification) {
      return left(new ResourceNotFoundError())
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowedError())
    }

    notification.read()

    this.notificationsRepository.save(notification)

    return right({
      notification,
    })
  }
}
