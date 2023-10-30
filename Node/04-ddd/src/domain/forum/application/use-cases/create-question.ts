import { Question } from "@/domain/forum/enterprise/entities/question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { type QuestionsRepository } from "../repositories/questions-repository";

interface CreateQuestionUseCaseRequest {
  title: string;
  content: string;
  authorId: string;
}

interface CreateQuestionUseCaseResponse {
  question: Question;
}

export class CreateQuestionUseCase {
  // eslint-disable-next-line
  constructor(private readonly questionsRepository: QuestionsRepository) { }

  async execute({
    title,
    content,
    authorId,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      title,
      content,
      authorId: new UniqueEntityId(authorId),
    });

    await this.questionsRepository.create(question);

    return {
      question,
    };
  }
}
