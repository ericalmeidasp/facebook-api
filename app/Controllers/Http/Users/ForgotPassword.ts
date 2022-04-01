import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User, UserKey } from 'App/Models'
import { RegisterValidator, UpdateValidator, ForgotValidator } from 'App/Validators/User/Register'
import Database from '@ioc:Adonis/Lucid/Database'
import faker from 'faker'
import Mail from '@ioc:Adonis/Addons/Mail'

export default class ForgorPasswordController {
  public async index({ request }: HttpContextContract) {
    const email = await request.validate(ForgotValidator)
  }

  public async store({ request }: HttpContextContract) {
    await Database.transaction(async (trx) => {
      const { email, redirectUrl } = await request.validate(RegisterValidator)
      const user = new User()
      user.email = email

      user.useTransaction(trx)
      await user.save()

      const key = faker.datatype.uuid() + user.id

      await user.related('keys').create({ key })

      const link = `${redirectUrl.replace(/\/$/, '')}/${key}`

      // envio

      await Mail.send((message) => {
        message.to(email)
        message.from('contato@fb.com', 'FacebookTest')
        message.subject('New Account')
        message.htmlView('emails/register', { link })
      })
    })

    return
  }

  public async show({ params }: HttpContextContract) {
    const userKey = await UserKey.findByOrFail('key', params.key)
    const user = await userKey.related('user').query().firstOrFail()

    return user
  }

  public async update({ request, response }: HttpContextContract) {
    const { key, name, password } = await request.validate(UpdateValidator)
    const userKey = await UserKey.findByOrFail('key', key)
    const user = await userKey.related('user').query().firstOrFail()

    const username = name.split(' ')[0].toLocaleLowerCase() + new Date().getTime()

    user.merge({ name, password, username })

    await user.save()

    await userKey.delete()

    return response.ok({ message: 'OK' })
  }
}
