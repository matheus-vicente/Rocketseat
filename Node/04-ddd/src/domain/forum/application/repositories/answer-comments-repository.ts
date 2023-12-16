import { type PaginationParams } from "@/core/repositories/pagination-params";
import { type AnswerComment } from "../../enterprise/entities/answer-comment";

export interface AnswerCommentsRepository {
  findById: (id: string) => Promise<AnswerComment | null>;
  delete: (answerComment: AnswerComment) => Promise<void>;
  create: (answerComment: AnswerComment) => Promise<void>;
  findManyByAnswerId: (
    answerId: string,
    params: PaginationParams,
  ) => Promise<AnswerComment[]>;
}
