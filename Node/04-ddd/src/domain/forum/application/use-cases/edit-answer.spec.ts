import { EditAnswerUseCase } from "./edit-answer";
import { makeAnswer } from "test/factories/make-answer";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe("Edit Answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );

    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository,
    );
  });

  it("Should be able to edit a answer", async () => {
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

    await sut.execute({
      content: "Edited content",
      authorId: "custom-author-id",
      answerId: answer.id.toString(),
      attachmentsIds: ["1", "3"],
    });

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: "Edited content",
    });
    expect(
      inMemoryAnswersRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
        expect.objectContaining({ attachmentId: new UniqueEntityId("3") }),
      ],
    );
  });

  it("Should not be able to edit a answer from another author", async () => {
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
      content: "New content",
      authorId: "author-2",
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
