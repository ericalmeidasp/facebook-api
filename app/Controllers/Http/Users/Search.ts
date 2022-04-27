import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User } from 'App/Models'

export default class SearchController {
  public async index({ request, response }: HttpContextContract) {
    const { keyword } = request.qs()

    if (!keyword) {
      return response.status(422).send({
        error: { message: 'missing user parameter' }
      })
    }

    const users = await User.query()
      .where('email', 'like', `%${keyword}%`)
      .orWhere('name', 'like', `%${keyword}%`)
      .orWhere('username', 'like', `%${keyword}%`)
      .preload('avatar')

    return users
  }
}
