import { makeQuestion } from "test/factories/make-question";
import { DeleteQuestionUseCase } from "./delete-question";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let inMemoryQuestionRepository: InMemoryQuestionsRepository;
let sut: DeleteQuestionUseCase;

describe("Delete Question", () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository();
    sut = new DeleteQuestionUseCase(inMemoryQuestionRepository);
  });

  it("Should be able to delete a question", async () => {
    const question = makeQuestion(
      {
        authorId: new UniqueEntityId("custom-author-id"),
      },
      new UniqueEntityId("custom-question-id"),
    );

    await inMemoryQuestionRepository.create(question);

    expect(question.id).toBeTruthy();

    await sut.execute({
      authorId: "custom-author-id",
      questionId: question.id.toString(),
    });

    expect(
      inMemoryQuestionRepository.items.find((item) => item.id === question.id),
    ).toBeFalsy();
  });

  it("Should not be able to delete a question from another author", async () => {
    const question = makeQuestion(
      {
        authorId: new UniqueEntityId("custom-author-id"),
      },
      new UniqueEntityId("custom-question-id"),
    );

    await inMemoryQuestionRepository.create(question);

    expect(question.id).toBeTruthy();

    expect(async () => {
      return await sut.execute({
        authorId: "another-author-id",
        questionId: question.id.toString(),
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
