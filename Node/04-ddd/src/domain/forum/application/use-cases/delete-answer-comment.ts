import { type AnswerCommentsRepository } from "../repositories/answer-comments-repository";

interface DeleteAnswerCommentUseCaseRequest {
  authorId: string;
  answerCommentId: string;
}

// eslint-disable-next-line
interface DeleteAnswerCommentUseCaseResponse { }

export class DeleteAnswerCommentUseCase {
  // eslint-disable-next-line
  constructor(private readonly answerCommentsRepository: AnswerCommentsRepository) { }

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId);

    if (!answerComment) {
      throw new Error("Not found.");
    }

    if (answerComment.authorId.toString() !== authorId) {
      throw new Error("Not allowed.");
    }

    await this.answerCommentsRepository.delete(answerComment);

    return {};
  }
}
