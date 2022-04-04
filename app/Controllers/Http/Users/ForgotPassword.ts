import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User, UserKey } from 'App/Models'
import { UpdateValidator, StoreValidator } from 'App/Validators/User/ForgotPassword'
// import Database from '@ioc:Adonis/Lucid/Database'
import faker from 'faker'
import Mail from '@ioc:Adonis/Addons/Mail'

export default class ForgotPasswordController {
  // public async index({ request }: HttpContextContract) {
  //   const email = await request.validate(ForgotValidator)
  // }

  public async store({ request, response }: HttpContextContract) {
    const { email, redirectUrl } = await request.validate(StoreValidator)
    const user = await User.findByOrFail('email', email)
    if (user.username === null) {
      return response.json({ message: 'Se cadastre primeiro' })
    }

    const key = faker.datatype.uuid() + user.id

    await user.related('keys').create({ key })

    const link = `${redirectUrl.replace(/\/$/, '')}/${key}`

    // envio

    await Mail.send((message) => {
      message.to(email)
      message.from('contato@fb.com', 'FacebookTest')
      message.subject('Recuperação de Conta')
      message.htmlView('emails/forgot', { link })
    })

    return
  }

  public async show({ params }: HttpContextContract) {
    const userKey = await UserKey.findByOrFail('key', params.key)
    const user = await userKey.related('user').query().firstOrFail()

    return user
  }

  public async update({ request, response }: HttpContextContract) {
    const { key, password } = await request.validate(UpdateValidator)
    const userKey = await UserKey.findByOrFail('key', key)
    const user = await userKey.related('user').query().firstOrFail()

    user.merge({ password })

    await user.save()

    await userKey.delete()

    return response.ok({ message: 'OK' })
  }
}
