import { makeQuestion } from "test/factories/make-question";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: FetchRecentQuestionsUseCase;

describe("Fetch Recent Questions", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );

    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository);
  });

  it("Should be able to fetch recent questions", async () => {
    vi.setSystemTime(new Date(2023, 9, 7));
    await inMemoryQuestionsRepository.create(makeQuestion({}));

    vi.setSystemTime(new Date(2023, 9, 6));
    await inMemoryQuestionsRepository.create(makeQuestion({}));

    vi.setSystemTime(new Date(2023, 9, 10));
    await inMemoryQuestionsRepository.create(makeQuestion({}));

    vi.setSystemTime(new Date(2023, 9, 2));
    await inMemoryQuestionsRepository.create(makeQuestion({}));

    const result = await sut.execute({
      page: 1,
    });

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2023, 9, 10) }),
      expect.objectContaining({ createdAt: new Date(2023, 9, 7) }),
      expect.objectContaining({ createdAt: new Date(2023, 9, 6) }),
      expect.objectContaining({ createdAt: new Date(2023, 9, 2) }),
    ]);
  });

  it("Should be able to fetch paginated recent questions", async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion());
    }

    const result = await sut.execute({
      page: 2,
    });

    expect(result.value?.questions).toHaveLength(2);
  });
});
