import { type QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { type QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository { // eslint-disable-line
  public items: QuestionComment[] = [];

  async create(questionComment: QuestionComment): Promise<void> {
    this.items.push(questionComment);
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    );

    this.items.splice(itemIndex, 1);
  }

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = this.items.find(
      (item) => item.id.toString() === id,
    );

    if (!questionComment) {
      return null;
    }

    return questionComment;
  }
}
