import { type Optional } from "@/core/types/optional";
import { AggregateRoot } from "@/core/entities/aggregate-root";
import { AnswerAttachmentList } from "./answer-attachment-list";
import { type UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerCreatedEvent } from "../events/answer-created-event";

export interface AnswerProps {
  content: string;
  authorId: UniqueEntityId;
  questionId: UniqueEntityId;
  attachments: AnswerAttachmentList;
  createdAt: Date;
  updatedAt?: Date;
}

export class Answer extends AggregateRoot<AnswerProps> {
  get content(): string {
    return this.props.content;
  }

  get authorId(): UniqueEntityId {
    return this.props.authorId;
  }

  get questionId(): UniqueEntityId {
    return this.props.questionId;
  }

  get attachments(): AnswerAttachmentList {
    return this.props.attachments;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get excerpt(): string {
    return this.content.substring(0, 120).trimEnd().concat("...");
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  set attachments(attachments: AnswerAttachmentList) {
    this.props.attachments = attachments;
  }

  static create(
    props: Optional<AnswerProps, "createdAt" | "attachments">,
    id?: UniqueEntityId,
  ): Answer {
    const answer = new Answer(
      {
        ...props,
        attachments: props.attachments ?? new AnswerAttachmentList(),
        createdAt: new Date(),
      },
      id,
    );

    const isNewAnswer = !id;

    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer));
    }

    return answer;
  }
}
