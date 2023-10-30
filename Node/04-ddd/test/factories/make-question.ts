import { faker } from "@faker-js/faker";

import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Question,
  type QuestionProps,
} from "@/domain/forum/enterprise/entities/question";

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityId,
): Question {
  const question = Question.create(
    {
      title: faker.lorem.sentence({ min: 4, max: 6 }),
      authorId: new UniqueEntityId(),
      content: faker.lorem.sentences(),
      ...override,
    },
    id,
  );

  return question;
}
