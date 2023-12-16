import { makeAnswer } from "test/factories/make-answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { FetchQuestionAnswersUseCase } from "./fetch-question-answers";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: FetchQuestionAnswersUseCase;

describe("Fetch Question Answers", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository);
  });

  it("Should be able to fetch recent question answers", async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityId("custom-question-id"),
      }),
    );

    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityId("custom-question-id"),
      }),
    );

    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityId("custom-question-id"),
      }),
    );

    const result = await sut.execute({
      questionId: "custom-question-id",
      page: 1,
    });

    expect(result.value?.answers).toHaveLength(3);
  });

  it("Should be able to fetch paginated recent question answers", async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityId("custom-question-id"),
        }),
      );
    }

    const result = await sut.execute({
      questionId: "custom-question-id",
      page: 2,
    });

    expect(result.value?.answers).toHaveLength(2);
  });
});
