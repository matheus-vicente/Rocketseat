import { UniqueEntityId } from "@/core/entities/unique-entity-id";

import { right, type Either } from "@/core/either";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { type AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";

interface AnswerQuestionUseCaseRequest {
  content: string;
  questionId: string;
  instructorId: string;
  attachmentIds: string[];
}

type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>;

export class AnswerQuestionUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    content,
    questionId,
    instructorId,
    attachmentIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
    });

    const answerAttachments = attachmentIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      });
    });

    answer.attachments = new AnswerAttachmentList(answerAttachments);

    await this.answersRepository.create(answer);

    return right({ answer });
  }
}
