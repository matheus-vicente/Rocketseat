import dayjs from "dayjs";

import { Slug } from "./value-objects/slug";
import { type Optional } from "@/core/types/optional";
import { AggregateRoot } from "@/core/entities/aggregate-root";
import { QuestionAttachmentList } from "./question-attachment-list";
import { type UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionBestAnswerChosenEvent } from "../events/question-best-answer-chosen-event";

export interface QuestionProps {
  slug: Slug;
  title: string;
  content: string;
  authorId: UniqueEntityId;
  bestAnswerId?: UniqueEntityId;
  attachments: QuestionAttachmentList;
  createdAt: Date;
  updatedAt?: Date;
}

export class Question extends AggregateRoot<QuestionProps> {
  get slug(): Slug {
    return this.props.slug;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  get authorId(): UniqueEntityId {
    return this.props.authorId;
  }

  get bestAnswerId(): UniqueEntityId | undefined {
    return this.props.bestAnswerId;
  }

  get attachments(): QuestionAttachmentList {
    return this.props.attachments;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, "days") <= 3;
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  set title(title: string) {
    this.props.title = title;
    this.props.slug = Slug.createFromText(title);
    this.touch();
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId) {
    if (bestAnswerId && bestAnswerId !== this.props.bestAnswerId) {
      this.addDomainEvent(
        new QuestionBestAnswerChosenEvent(this, bestAnswerId),
      );
    }

    this.props.bestAnswerId = bestAnswerId;

    this.touch();
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments;
    this.touch();
  }

  static create(
    props: Optional<QuestionProps, "createdAt" | "slug" | "attachments">,
    id?: UniqueEntityId,
  ): Question {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: new Date(),
      },
      id,
    );

    return question;
  }
}
