import * as Axios from 'axios'
import { config } from './helpers'

export const configData = () => {
  const { defaults } = Axios.default
  defaults.baseURL = config.backendURL
  // defaults.headers.common['Authorization'] = AUTH_TOKEN
  defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
}

export const getData = async (...args: [string]): Promise<any> =>
  await Axios.default.get.apply(null, args)

export const postData = async (...args: [string, any]) => {
  console.log('args:')
  console.log(args)
  return await Axios.default.post.apply(null, args)
}

export const putData = async (...args: [string, any]) =>
  await Axios.default.put.apply(null, args)

export const deleteData = async (...args: [string]) =>
  await Axios.default.delete.apply(null, args)
