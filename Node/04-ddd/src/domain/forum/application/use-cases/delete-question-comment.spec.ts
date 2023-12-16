import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe("Delete Question Comment", () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
  });

  it("Should be able to delete an question comment", async () => {
    const questionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityId("custom-author-id"),
      },
      new UniqueEntityId("custom-question-comment-id"),
    );

    await inMemoryQuestionCommentsRepository.create(questionComment);

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(1);

    await sut.execute({
      authorId: "custom-author-id",
      questionCommentId: "custom-question-comment-id",
    });

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
  });

  it("Should not be able to delete an question comment from another author", async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityId("custom-author-id"),
    });

    await inMemoryQuestionCommentsRepository.create(questionComment);

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(1);

    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: "author-2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
