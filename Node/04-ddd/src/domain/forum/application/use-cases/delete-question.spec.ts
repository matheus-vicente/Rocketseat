import { DeleteQuestionUseCase } from "./delete-question";
import { makeQuestion } from "test/factories/make-question";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: DeleteQuestionUseCase;

describe("Delete Question", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
  });

  it("Should be able to delete a question", async () => {
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

    expect(question.id).toBeTruthy();

    await sut.execute({
      authorId: "custom-author-id",
      questionId: question.id.toString(),
    });

    expect(inMemoryQuestionsRepository.items).toHaveLength(0);
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0);
  });

  it("Should not be able to delete a question from another author", async () => {
    const question = makeQuestion(
      {
        authorId: new UniqueEntityId("custom-author-id"),
      },
      new UniqueEntityId("custom-question-id"),
    );

    await inMemoryQuestionsRepository.create(question);

    expect(question.id).toBeTruthy();

    const result = await sut.execute({
      questionId: "custom-question-id",
      authorId: "author-2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
