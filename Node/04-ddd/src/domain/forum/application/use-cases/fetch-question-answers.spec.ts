import { makeAnswer } from "test/factories/make-answer";
import { FetchQuestionAnswersUseCase } from "./fetch-question-answers";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: FetchQuestionAnswersUseCase;

describe("Fetch Questions Answers", () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
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

    const { answers } = await sut.execute({
      page: 1,
      questionId: "custom-question-id",
    });

    expect(answers).toHaveLength(3);
  });

  it("Should be able to fetch paginated recent question answers", async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityId("custom-question-id"),
        }),
      );
    }

    const { answers } = await sut.execute({
      page: 2,
      questionId: "custom-question-id",
    });

    expect(answers).toHaveLength(2);
  });
});
