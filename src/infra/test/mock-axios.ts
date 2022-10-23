import { faker } from '@faker-js/faker'
import axios from 'axios'
import { Mocked } from 'vitest'

export const mockHttpResponse = (): any => ({
  data: faker.datatype.json(),
  status: faker.random.numeric(),
})

export const mockAxios = (
  httpResponse = mockHttpResponse()
): Mocked<typeof axios> => {
  const mockedAxios = axios as Mocked<typeof axios>
  mockedAxios.post.mockResolvedValueOnce(httpResponse)

  return mockedAxios
}
