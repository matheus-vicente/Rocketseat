import { DomainEvents } from "@/core/events/domain-events";
import { type EventHandler } from "@/core/events/event-handler";
import { type SendNotificationUseCase } from "../use-cases/send-notification";
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event";
import { type QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";

export class OnAnswerCreated implements EventHandler {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  async setupSubscriptions(): Promise<void> {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this), // eslint-disable-line
      AnswerCreatedEvent.name,
    );
  }

  private async sendNewAnswerNotification({
    answer,
  }: AnswerCreatedEvent): Promise<void> {
    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    );

    console.log(answer, question);

    if (question) {
      const questionTitle = question.title.substring(0, 40).concat("...");

      await this.sendNotification.execute({
        title: `Nova resposta em "${questionTitle}"`,
        content: answer.excerpt,
        recipientId: question.authorId.toString(),
      });
    }
  }
}
