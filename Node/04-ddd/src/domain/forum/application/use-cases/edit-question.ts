import { type Question } from "../../enterprise/entities/question";
import { type QuestionsRepository } from "../repositories/questions-repository";

interface EditQuestionUseCaseRequest {
  title: string;
  content: string;
  authorId: string;
  questionId: string;
}

interface EditQuestionUseCaseResponse {
  question: Question;
}

export class EditQuestionUseCase {
  // eslint-disable-next-line
  constructor(private readonly questionsRepository: QuestionsRepository) { }

  async execute({
    title,
    content,
    authorId,
    questionId,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      throw new Error("Question not found.");
    }

    if (authorId !== question.authorId.toString()) {
      throw new Error("Not allowed.");
    }

    question.title = title;
    question.content = content;

    await this.questionsRepository.save(question);

    return {
      question,
    };
  }
}
