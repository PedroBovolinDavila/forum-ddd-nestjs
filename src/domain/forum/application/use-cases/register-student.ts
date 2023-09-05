import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Student } from '../../enterprise/entities/student'
import { StudentsRepository } from '../repositories/students-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { StudentAlredyExistsError } from './errors/student-alredy-exists-error'

interface RegisterStudentUseCaseParams {
  name: string
  email: string
  password: string
}

type RegisterStudentUseCaseReponse = Either<
  StudentAlredyExistsError,
  { student: Student }
>

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseParams): Promise<RegisterStudentUseCaseReponse> {
    const userWithSameEmail = await this.studentsRepository.findByEmail(email)

    if (userWithSameEmail) {
      return left(new StudentAlredyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const student = Student.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.studentsRepository.create(student)

    return right({
      student,
    })
  }
}
