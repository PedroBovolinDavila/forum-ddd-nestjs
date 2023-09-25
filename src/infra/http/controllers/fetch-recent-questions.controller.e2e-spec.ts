import request from 'supertest'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Fetch recent questions (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
    })

    await Promise.all([
      questionFactory.makePrismaQuestion({
        title: 'question 03',
        content: 'question content',
        authorId: user.id,
        createdAt: new Date(2023, 1, 3),
      }),
      questionFactory.makePrismaQuestion({
        title: 'question 02',
        content: 'question content',
        authorId: user.id,
        createdAt: new Date(2023, 1, 2),
      }),

      questionFactory.makePrismaQuestion({
        title: 'question 01',
        content: 'question content',
        authorId: user.id,
        createdAt: new Date(2023, 1, 1),
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'question 03' }),
        expect.objectContaining({ title: 'question 02' }),
        expect.objectContaining({ title: 'question 01' }),
      ],
    })
  })
})
