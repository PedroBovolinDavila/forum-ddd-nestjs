import request from 'supertest'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { QuestionFactory } from 'test/factories/make-question'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment'

describe('Edit question (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)

    await app.init()
  })

  test('[PUT] /questions/:id', async () => {
    const user = await studentFactory.makePrismaStudent()
    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment1.id,
      questionId: question.id,
    })
    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment2.id,
      questionId: question.id,
    })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
    })

    const attachment3 = await attachmentFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer())
      .put(`/questions/${question.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New Title',
        content: 'New Content',
        attachments: [attachment1.id.toString(), attachment3.id.toString()],
      })

    expect(response.statusCode).toBe(204)

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'New Title',
      },
    })

    expect(questionOnDatabase).toEqual(
      expect.objectContaining({
        title: 'New Title',
        content: 'New Content',
        slug: 'new-title',
      }),
    )

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: questionOnDatabase?.id,
      },
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
    expect(attachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.toString(),
        }),
        expect.objectContaining({
          id: attachment3.id.toString(),
        }),
      ]),
    )
  })
})
