import { type AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { type AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository { // eslint-disable-line
  public items: AnswerComment[] = [];

  async create(answerComment: AnswerComment): Promise<void> {
    this.items.push(answerComment);
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    );

    this.items.splice(itemIndex, 1);
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = this.items.find((item) => item.id.toString() === id);

    if (!answerComment) {
      return null;
    }

    return answerComment;
  }
}
