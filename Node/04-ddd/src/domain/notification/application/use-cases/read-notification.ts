import { type Either, right, left } from "@/core/either";
import { type Notification } from "../../enterprise/entities/notification";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { type NotificationsRepository } from "../repositories/notifications-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

interface ReadNotificationUseCaseRequest {
  recipientId: string;
  notificationId: string;
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification;
  }
>;

export class ReadNotificationUseCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId);

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowedError());
    }

    notification.read();

    return right({
      notification,
    });
  }
}
