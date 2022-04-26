import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UpdateValidator } from 'App/Validators/Reactions/Main'
import { Reaction } from 'App/Models'

export default class ReactionsController {
  public async update({ request, auth }: HttpContextContract) {
    const { type, postId } = await request.validate(UpdateValidator)
    const userId = auth.user!.id

    const reaction = await Reaction.updateOrCreate({ postId, userId }, { type })

    return reaction
  }

  public async destroy({ params, auth, response }: HttpContextContract) {
    const reaction = await Reaction.findOrFail(params.id)
    if (reaction.userId !== auth.user!.id) {
      return response.unauthorized()
    }
    await reaction.delete()
  }
}
