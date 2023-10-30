import { makeAnswer } from "test/factories/make-answer";
import { makeQuestion } from "test/factories/make-question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe("Create Answer", () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryQuestionsRepository,
    );
  });

  it("Should be able to choose the best answer for a question", async () => {
    const question = makeQuestion({}, new UniqueEntityId("custom-question-id"));
    const answer = makeAnswer(
      {
        questionId: question.id,
      },
      new UniqueEntityId("custom-answer-id"),
    );

    inMemoryQuestionsRepository.create(question);
    inMemoryAnswersRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });

    expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(
      answer.id,
    );
  });

  it("Should not be able to choose the best answer for a question from another author", async () => {
    const question = makeQuestion(
      {
        authorId: new UniqueEntityId("author-01"),
      },
      new UniqueEntityId("custom-question-id"),
    );
    const answer = makeAnswer(
      {
        questionId: question.id,
      },
      new UniqueEntityId("custom-answer-id"),
    );

    inMemoryQuestionsRepository.create(question);
    inMemoryAnswersRepository.create(answer);

    expect(async () => {
      return await sut.execute({
        answerId: answer.id.toString(),
        authorId: "custom-author-id",
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
