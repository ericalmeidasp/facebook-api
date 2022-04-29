import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Conversation } from 'App/Models'

export default class ConversationsController {
  public async index({ auth }: HttpContextContract) {
    const user = auth.user!
    const conversations = await Conversation.query()
      .where({ userIdOne: user.id })
      .orWhere({ userIdTwo: user.id })
      .preload('userOne', (query) => query.preload('avatar'))
      .preload('userTwo', (query) => query.preload('avatar'))
      .orderBy('id', 'desc')

    const queries = conversations.map((conversation) =>
      conversation.userIdOne === user.id
        ? { id: conversation.id, user: conversation.userTwo }
        : { id: conversation.id, user: conversation.userOne }
    )

    return queries
  }

  public async show({ response, auth, params }: HttpContextContract) {
    const conversation = await Conversation.findOrFail(params.id)

    if (![conversation.userIdOne, conversation.userIdTwo].includes(auth.user!.id)) {
      return response.unauthorized()
    }

    await conversation.load('messages')

    return conversation
  }
}
