import { type Answer } from "../../enterprise/entities/answer";
import { type AnswersRepository } from "../repositories/answers-repository";

interface EditAnswerUseCaseRequest {
  content: string;
  authorId: string;
  answerId: string;
}

interface EditAnswerUseCaseResponse {
  answer: Answer;
}

export class EditAnswerUseCase {
  // eslint-disable-next-line
  constructor(private readonly answersRepository: AnswersRepository) { }

  async execute({
    content,
    authorId,
    answerId,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found.");
    }

    if (authorId !== answer.authorId.toString()) {
      throw new Error("Not allowed.");
    }

    answer.content = content;

    await this.answersRepository.save(answer);

    return {
      answer,
    };
  }
}
