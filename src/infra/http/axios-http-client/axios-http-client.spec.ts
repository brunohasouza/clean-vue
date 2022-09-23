import { describe, expect, test, vi, Mocked } from 'vitest'
import { faker } from '@faker-js/faker'
import axios from 'axios'
import { AxiosHttpClient } from './axios-http-client'

vi.mock('axios')
const mockedAxios = axios as Mocked<typeof axios>

describe('AxiosHttpClient', () => {
  test('Should call axios with correct URL', async () => {
    const url = faker.internet.url()
    const sut = new AxiosHttpClient()
    await sut.post({ url })

    expect(mockedAxios).toHaveBeenCalledWith(url)
  })
})
