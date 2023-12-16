import { DomainEvents } from "@/core/events/domain-events";
import { type EventHandler } from "@/core/events/event-handler";
import { type AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { type SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification";
import { QuestionBestAnswerChosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-chosen-event";

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this), // eslint-disable-line
      QuestionBestAnswerChosenEvent.name,
    );
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent): Promise<void> {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    );

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Sua resposta foi escolhida!`,
        content: `A resposta que você enviou em "${question.title
          .substring(0, 20)
          .concat("...")}" foi escolhida pelo autor!"`,
      });
    }
  }
}
