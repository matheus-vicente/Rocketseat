import { type QuestionCommentsRepository } from "../repositories/question-comments-repository";

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string;
  questionCommentId: string;
}

// eslint-disable-next-line
interface DeleteQuestionCommentUseCaseResponse { }

export class DeleteQuestionCommentUseCase {
  // eslint-disable-next-line
  constructor(private readonly questionCommentsRepository: QuestionCommentsRepository) { }

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId);

    if (!questionComment) {
      throw new Error("Not found.");
    }

    if (questionComment.authorId.toString() !== authorId) {
      throw new Error("Not allowed.");
    }

    await this.questionCommentsRepository.delete(questionComment);

    return {};
  }
}
