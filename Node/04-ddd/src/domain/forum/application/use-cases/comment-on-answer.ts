import { type Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { type AnswersRepository } from "../repositories/answers-repository";
import { type AnswerCommentsRepository } from "../repositories/answer-comments-repository";

interface CommentOnAnswerUseCaseRequest {
  content: string;
  authorId: string;
  answerId: string;
}

type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answerComment: AnswerComment;
  }
>;

export class CommentOnAnswerUseCase {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    content,
    authorId,
    answerId,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new NotAllowedError());
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new ResourceNotFoundError());
    }

    const answerComment = AnswerComment.create({
      content,
      authorId: new UniqueEntityId(authorId),
      answerId: new UniqueEntityId(answerId),
    });

    await this.answerCommentsRepository.create(answerComment);

    return right({
      answerComment,
    });
  }
}
