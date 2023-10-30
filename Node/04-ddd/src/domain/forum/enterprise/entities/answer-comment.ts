import { type Optional } from "@/core/types/optional";
import { Comment, type CommentProps } from "./comment";
import { type UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface AnswerCommentProps extends CommentProps {
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  authorId: UniqueEntityId;
  answerId: UniqueEntityId;
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId(): UniqueEntityId {
    return this.props.answerId;
  }

  static create(
    props: Optional<AnswerCommentProps, "createdAt">,
    id?: UniqueEntityId,
  ): AnswerComment {
    const answercomment = new AnswerComment(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    return answercomment;
  }
}
