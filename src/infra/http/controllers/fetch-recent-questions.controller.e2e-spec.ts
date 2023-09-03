import request from 'supertest'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Fetch recent questions (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      },
    })

    const accessToken = jwt.sign({
      sub: user.id,
    })

    await prisma.question.createMany({
      data: [
        {
          title: 'question 01',
          slug: 'question-01',
          content: 'question content',
          authorId: user.id,
        },
        {
          title: 'question 02',
          slug: 'question-02',
          content: 'question content',
          authorId: user.id,
        },
        {
          title: 'question 03',
          slug: 'question-03',
          content: 'question content',
          authorId: user.id,
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'question 01' }),
        expect.objectContaining({ title: 'question 02' }),
        expect.objectContaining({ title: 'question 03' }),
      ],
    })
  })
})
