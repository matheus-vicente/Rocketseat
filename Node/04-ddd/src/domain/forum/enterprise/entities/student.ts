import { Entity } from "@/core/entities/entity";
import { type UniqueEntityId } from "@/core/entities/unique-entity-id";

interface StudentProps {
  name: string;
}

export class Student extends Entity<StudentProps> {
  get name(): string {
    return this.props.name;
  }

  static create(props: StudentProps, id: UniqueEntityId): Student {
    const student = new Student(props, id);

    return student;
  }
}
