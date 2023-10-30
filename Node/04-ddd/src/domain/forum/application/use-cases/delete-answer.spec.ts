import { makeAnswer } from "test/factories/make-answer";
import { DeleteAnswerUseCase } from "./delete-answer";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let inMemoryAnswerRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe("Delete Answer", () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswersRepository();
    sut = new DeleteAnswerUseCase(inMemoryAnswerRepository);
  });

  it("Should be able to delete a answer", async () => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityId("custom-author-id"),
      },
      new UniqueEntityId("custom-answer-id"),
    );

    await inMemoryAnswerRepository.create(answer);

    expect(answer.id).toBeTruthy();

    await sut.execute({
      authorId: "custom-author-id",
      answerId: answer.id.toString(),
    });

    expect(
      inMemoryAnswerRepository.items.find((item) => item.id === answer.id),
    ).toBeFalsy();
  });

  it("Should not be able to delete a answer from another author", async () => {
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
        authorId: "another-author-id",
        answerId: answer.id.toString(),
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
