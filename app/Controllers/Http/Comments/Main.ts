import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator, UpdateValidator } from 'App/Validators/Comments/Main'
import { Comment } from 'App/Models'

export default class CommentsController {
  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)

    const comment = await auth.user!.related('comments').create(data)
    await comment.load('user', (query) => {
      query.preload('avatar')
    })

    return comment
  }

  public async update({ request, response, params, auth }: HttpContextContract) {
    const { content } = await request.validate(UpdateValidator)

    const comment = await Comment.findOrFail(params.id)

    if (comment.userId !== auth.user!.id) {
      return response.unauthorized()
    }

    comment.merge({ content })

    await comment.save()

    return comment
  }

  public async destroy({ response, params, auth }: HttpContextContract) {
    const comment = await Comment.findOrFail(params.id)

    if (comment.userId !== auth.user!.id) {
      return response.unauthorized()
    }

    await comment.delete()
    return response.ok({ msg: 'success' })
  }
}
