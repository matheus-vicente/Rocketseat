import { makeQuestion } from "test/factories/make-question";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe("Get Question By Slug", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );

    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it("Should be able to return a question using a slug", async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create("nova-pergunta"),
    });

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      slug: "nova-pergunta",
    });

    if (result.isRight()) {
      expect(result.value?.question.id).toBeTruthy();
      expect(result.value?.question.title).toEqual(newQuestion.title);
    }
  });
});
