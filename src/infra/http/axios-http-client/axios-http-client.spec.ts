import { describe, expect, test, vi, Mocked } from 'vitest'
import { faker } from '@faker-js/faker'
import axios from 'axios'
import { AxiosHttpClient } from './axios-http-client'
import { HttpPostParams } from '@/data/protocols/http'

vi.mock('axios')
const mockedAxios = axios as Mocked<typeof axios>
const mocketAxiosResult = {
  data: faker.datatype.json(),
  status: faker.random.numeric(),
}
mockedAxios.post.mockResolvedValue(mocketAxiosResult)

const makeSut = (): AxiosHttpClient => {
  const sut = new AxiosHttpClient()

  return sut
}

const mockPostRequest = (): HttpPostParams<any> => ({
  url: faker.internet.url(),
  body: faker.datatype.json(),
})

describe('AxiosHttpClient', () => {
  test('Should call axios with correct values', async () => {
    const request = mockPostRequest()
    const sut = makeSut()

    await sut.post(request)

    expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body)
  })

  test('Should return the correct statusCode and body', async () => {
    const sut = makeSut()

    const httpResponse = await sut.post(mockPostRequest())

    expect(httpResponse).toEqual({
      statusCode: mocketAxiosResult.status,
      body: mocketAxiosResult.data,
    })
  })
})
