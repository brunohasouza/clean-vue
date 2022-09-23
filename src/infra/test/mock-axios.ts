import { faker } from '@faker-js/faker'
import axios from 'axios'
import { Mocked } from 'vitest'

export const mockAxios = (): Mocked<typeof axios> => {
  const mockedAxios = axios as Mocked<typeof axios>
  mockedAxios.post.mockResolvedValueOnce({
    data: faker.datatype.json(),
    status: faker.random.numeric(),
  })

  return mockedAxios
}
