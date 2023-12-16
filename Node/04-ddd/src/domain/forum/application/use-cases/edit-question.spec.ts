import { EditQuestionUseCase } from "./edit-question";
import { makeQuestion } from "test/factories/make-question";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: EditQuestionUseCase;

describe("Edit Question", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );

    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository,
    );
  });

  it("Should be able to edit a question", async () => {
    const question = makeQuestion(
      {
        authorId: new UniqueEntityId("custom-author-id"),
      },
      new UniqueEntityId("custom-question-id"),
    );

    await inMemoryQuestionsRepository.create(question);

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: question.id,
        attachmentId: new UniqueEntityId("1"),
      }),
      makeQuestionAttachment({
        questionId: question.id,
        attachmentId: new UniqueEntityId("2"),
      }),
    );

    await sut.execute({
      title: "Edited title",
      content: "Edited content",
      authorId: "custom-author-id",
      questionId: question.id.toString(),
      attachmentIds: ["1", "3"],
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: "Edited title",
      content: "Edited content",
    });

    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("3") }),
    ]);
  });

  it("Should not be able to edit a question from another author", async () => {
    const question = makeQuestion(
      {
        authorId: new UniqueEntityId("custom-author-id"),
      },
      new UniqueEntityId("custom-question-id"),
    );

    await inMemoryQuestionsRepository.create(question);

    expect(question.id).toBeTruthy();

    const result = await sut.execute({
      questionId: question.id.toValue(),
      title: "Edited title",
      content: "Edited content",
      authorId: "another-author-id",
      attachmentIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
