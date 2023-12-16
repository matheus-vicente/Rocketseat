import { type Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { type QuestionsRepository } from "../repositories/questions-repository";
import { type QuestionCommentsRepository } from "../repositories/question-comments-repository";

interface CommentOnQuestionUseCaseRequest {
  content: string;
  authorId: string;
  questionId: string;
}

type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    questionComment: QuestionComment;
  }
>;

export class CommentOnQuestionUseCase {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    content,
    authorId,
    questionId,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    const questionComment = QuestionComment.create({
      content,
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
    });

    await this.questionCommentsRepository.create(questionComment);

    return right({
      questionComment,
    });
  }
}
