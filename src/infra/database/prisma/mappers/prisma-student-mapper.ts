import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { Prisma, User } from '@prisma/client'

export class PrismaStudentMapper {
  static toDomain(raw: User): Student {
    const student = Student.create(
      {
        name: raw.name,
        email: raw.name,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )

    return student
  }

  static toPersistence(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      password: student.password,
    }
  }
}
