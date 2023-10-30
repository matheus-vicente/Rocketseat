import { faker } from "@faker-js/faker";

import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Answer,
  type AnswerProps,
} from "@/domain/forum/enterprise/entities/answer";

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityId,
): Answer {
  const answer = Answer.create(
    {
      authorId: new UniqueEntityId(),
      content: faker.lorem.sentences(),
      questionId: new UniqueEntityId(),
      ...override,
    },
    id,
  );

  return answer;
}
