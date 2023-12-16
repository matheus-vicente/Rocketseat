import { DeleteAnswerUseCase } from "./delete-answer";
import { makeAnswer } from "test/factories/make-answer";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe("Delete Answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
  });

  it("Should be able to delete a answer", async () => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityId("custom-author-id"),
      },
      new UniqueEntityId("custom-answer-id"),
    );

    await inMemoryAnswersRepository.create(answer);

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: answer.id,
        attachmentId: new UniqueEntityId("1"),
      }),
      makeAnswerAttachment({
        answerId: answer.id,
        attachmentId: new UniqueEntityId("2"),
      }),
    );

    expect(answer.id).toBeTruthy();

    await sut.execute({
      authorId: "custom-author-id",
      answerId: answer.id.toString(),
    });

    expect(
      inMemoryAnswersRepository.items.find((item) => item.id === answer.id),
    ).toBeFalsy();
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0);
  });

  it("Should not be able to delete a answer from another author", async () => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityId("custom-author-id"),
      },
      new UniqueEntityId("custom-answer-id"),
    );

    await inMemoryAnswersRepository.create(answer);

    expect(answer.id).toBeTruthy();

    const result = await sut.execute({
      answerId: "custom-answer-id",
      authorId: "author-2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
