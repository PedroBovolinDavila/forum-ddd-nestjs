import { expect, test } from 'vitest'
import { Either, left, right } from './either'

function doSomething(shouldSucess: boolean): Either<string, string> {
  if (shouldSucess) {
    return right('success')
  } else {
    return left('error')
  }
}

test(`Success result`, () => {
  const result = doSomething(true)

  expect(result.isRight()).toEqual(true)
})

test(`Error result`, () => {
  const result = doSomething(false)

  expect(result.isLeft()).toEqual(true)
})
