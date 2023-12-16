import { right, type Either, left } from "@/core/either";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { type Question } from "../../enterprise/entities/question";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { type QuestionsRepository } from "../repositories/questions-repository";
import { type QuestionAttachmentsRepository } from "../repositories/question-attachments-repository";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface EditQuestionUseCaseRequest {
  title: string;
  content: string;
  authorId: string;
  questionId: string;
  attachmentIds: string[];
}

type EditQuestionUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { question: Question }
>;

export class EditQuestionUseCase {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    title,
    content,
    authorId,
    questionId,
    attachmentIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId);

    const questionAttachmentsList = new QuestionAttachmentList(
      currentQuestionAttachments,
    );

    const questionAttachments = attachmentIds.map((attachmentId) => {
      return QuestionAttachment.create({
        questionId: question.id,
        attachmentId: new UniqueEntityId(attachmentId),
      });
    });

    questionAttachmentsList.update(questionAttachments);

    question.attachments = questionAttachmentsList;
    question.title = title;
    question.content = content;

    await this.questionsRepository.save(question);

    return right({
      question,
    });
  }
}
