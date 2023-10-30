import { type Optional } from "@/core/types/optional";
import { Comment, type CommentProps } from "./comment";
import { type UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface QuestionCommentProps extends CommentProps {
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  authorId: UniqueEntityId;
  questionId: UniqueEntityId;
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId(): UniqueEntityId {
    return this.props.questionId;
  }

  static create(
    props: Optional<QuestionCommentProps, "createdAt">,
    id?: UniqueEntityId,
  ): QuestionComment {
    const questioncomment = new QuestionComment(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    return questioncomment;
  }
}
