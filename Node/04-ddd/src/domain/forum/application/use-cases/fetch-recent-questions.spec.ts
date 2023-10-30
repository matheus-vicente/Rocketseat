import { makeQuestion } from "test/factories/make-question";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: FetchRecentQuestionsUseCase;

describe("Fetch Recent Questions", () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
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

    const { questions } = await sut.execute({
      page: 1,
    });

    expect(questions).toEqual([
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

    const { questions } = await sut.execute({
      page: 2,
    });

    expect(questions).toHaveLength(2);
  });
});
