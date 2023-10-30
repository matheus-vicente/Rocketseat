import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { EditQuestionUseCase } from "./edit-question";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";

let inMemoryQuestionRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe("Edit Question", () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository();
    sut = new EditQuestionUseCase(inMemoryQuestionRepository);
  });

  it("Should be able to edit a question", async () => {
    const question = makeQuestion(
      {
        authorId: new UniqueEntityId("custom-author-id"),
      },
      new UniqueEntityId("custom-question-id"),
    );

    await inMemoryQuestionRepository.create(question);

    await sut.execute({
      title: "Edited title",
      content: "Edited content",
      authorId: "custom-author-id",
      questionId: question.id.toString(),
    });

    expect(inMemoryQuestionRepository.items[0]).toMatchObject({
      title: "Edited title",
      content: "Edited content",
    });
  });

  it("Should not be able to edit a question from another author", async () => {
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
        title: "Edited title",
        content: "Edited content",
        authorId: "another-author-id",
        questionId: question.id.toString(),
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
