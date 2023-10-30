import { Entity } from "@/core/entities/entity";
import { type Optional } from "@/core/types/optional";
import { type UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface AnswerProps {
  content: string;
  authorId: UniqueEntityId;
  questionId: UniqueEntityId;
  createdAt: Date;
  updatedAt?: Date;
}

export class Answer extends Entity<AnswerProps> {
  get content(): string {
    return this.props.content;
  }

  get authorId(): UniqueEntityId {
    return this.props.authorId;
  }

  get questionId(): UniqueEntityId {
    return this.props.questionId;
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

  static create(
    props: Optional<AnswerProps, "createdAt">,
    id?: UniqueEntityId,
  ): Answer {
    const answer = new Answer(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    return answer;
  }
}
