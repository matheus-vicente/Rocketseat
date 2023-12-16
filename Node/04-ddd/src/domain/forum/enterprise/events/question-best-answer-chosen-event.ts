import { type Question } from "../entities/question";
import { type DomainEvent } from "@/core/events/domain-event";
import { type UniqueEntityId } from "@/core/entities/unique-entity-id";

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  public ocurredAt: Date;
  public question: Question;
  public bestAnswerId: UniqueEntityId;

  constructor(question: Question, bestAnswerId: UniqueEntityId) {
    this.question = question;
    this.bestAnswerId = bestAnswerId;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.question.id;
  }
}