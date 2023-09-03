import { hash } from 'bcryptjs'
import request from 'supertest'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: await hash('123456', 8),
      },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.body).toEqual({
      accessToken: expect.any(String),
    })
  })
})
