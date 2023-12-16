import { type NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import { type Notification } from "@/domain/notification/enterprise/entities/notification";

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = [];

  async create(notification: Notification): Promise<void> {
    this.items.push(notification);
  }

  async findById(id: string): Promise<Notification | null> {
    const itemIndex = this.items.find((item) => item.id.toString() === id);

    if (!itemIndex) {
      return null;
    }

    return itemIndex;
  }

  async save(notification: Notification): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === notification.id,
    );

    this.items[itemIndex] = notification;
  }
}
