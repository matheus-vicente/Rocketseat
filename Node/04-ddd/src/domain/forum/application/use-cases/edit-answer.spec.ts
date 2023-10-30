import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { EditAnswerUseCase } from "./edit-answer";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";

let inMemoryAnswerRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe("Edit Answer", () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswersRepository();
    sut = new EditAnswerUseCase(inMemoryAnswerRepository);
  });

  it("Should be able to edit a answer", async () => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityId("custom-author-id"),
      },
      new UniqueEntityId("custom-answer-id"),
    );

    await inMemoryAnswerRepository.create(answer);

    await sut.execute({
      content: "Edited content",
      authorId: "custom-author-id",
      answerId: answer.id.toString(),
    });

    expect(inMemoryAnswerRepository.items[0]).toMatchObject({
      content: "Edited content",
    });
  });

  it("Should not be able to edit a answer from another author", async () => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityId("custom-author-id"),
      },
      new UniqueEntityId("custom-answer-id"),
    );

    await inMemoryAnswerRepository.create(answer);

    expect(answer.id).toBeTruthy();

    expect(async () => {
      return await sut.execute({
        content: "Edited content",
        authorId: "another-author-id",
        answerId: answer.id.toString(),
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
