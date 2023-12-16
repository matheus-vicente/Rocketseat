import { DomainEvents } from "@/core/events/domain-events";
import { type Question } from "@/domain/forum/enterprise/entities/question";
import { type PaginationParams } from "@/core/repositories/pagination-params";
import { type QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { type QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private readonly questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async create(question: Question): Promise<void> {
    this.items.push(question);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find(
      (question) => question.slug.value === slug,
    );

    if (!question) {
      return null;
    }

    return question;
  }

  async findById(id: string): Promise<Question | null> {
    const itemIndex = this.items.find((item) => item.id.toString() === id);

    if (!itemIndex) {
      return null;
    }

    return itemIndex;
  }

  async delete(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    );

    this.items.splice(itemIndex, 1);
  }

  async save(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.items[itemIndex] = question;

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }
}
