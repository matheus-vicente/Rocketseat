import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { DeleteAnswerCommentUseCase } from "./delete-answer-comment";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe("Delete Answer Comment", () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
  });

  it("Should be able to delete an answer comment", async () => {
    const answerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityId("custom-author-id"),
      },
      new UniqueEntityId("custom-answer-comment-id"),
    );

    await inMemoryAnswerCommentsRepository.create(answerComment);

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(1);

    await sut.execute({
      authorId: "custom-author-id",
      answerCommentId: "custom-answer-comment-id",
    });

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
  });

  it("Should not be able to delete an answer comment from another author", async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityId("custom-author-id"),
    });

    await inMemoryAnswerCommentsRepository.create(answerComment);

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(1);

    const result = await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: "another-author",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
