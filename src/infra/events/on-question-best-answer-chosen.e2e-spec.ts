import request from 'supertest'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { QuestionFactory } from 'test/factories/make-question'
import { AnswerFactory } from 'test/factories/make-answer'
import { waitFor } from 'test/utils/wait-for'
import { DomainEvents } from '@/core/events/domain-events'

describe('On question best answer chosen (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when question best answer is chosen', async () => {
    const answerUser = await studentFactory.makePrismaStudent()
    const user = await studentFactory.makePrismaStudent()
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })
    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: answerUser.id,
    })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
    })

    const answerId = answer.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/answers/${answerId}/choose-as-best`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: answerUser.id.toString(),
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
