import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { type AnswerCommentsRepository } from "../repositories/answer-comments-repository";
import { type AnswersRepository } from "../repositories/answers-repository";

interface CommentOnAnswerUseCaseRequest {
  content: string;
  authorId: string;
  answerId: string;
}

interface CommentOnAnswerUseCaseResponse {
  answerComment: AnswerComment;
}

export class CommentOnAnswerUseCase {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly answerCommentsRepository: AnswerCommentsRepository,
  ) { } // eslint-disable-line

  async execute({
    content,
    authorId,
    answerId,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found.");
    }

    if (answer.authorId.toString() !== authorId) {
      throw new Error("Not allowed.");
    }

    const answerComment = AnswerComment.create({
      content,
      authorId: new UniqueEntityId(authorId),
      answerId: new UniqueEntityId(answerId),
    });

    await this.answerCommentsRepository.create(answerComment);

    return {
      answerComment,
    };
  }
}
