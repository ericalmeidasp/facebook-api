import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User } from 'App/Models'
import { isFollowing } from 'App/Utils'

export default class ProfilesController {
  public async show({ params, auth }: HttpContextContract) {
    const { username } = params

    const user = await User.query()
      .where({ username })
      .preload('avatar')
      .withCount('posts')
      .withCount('followers')
      .withCount('following')
      .firstOrFail()

    await isFollowing(user, auth)

    return user.serialize({
      fields: {
        omit: ['email', 'createdAt', 'updatedAt', 'rememberMeToken']
      }
    })
  }
}
