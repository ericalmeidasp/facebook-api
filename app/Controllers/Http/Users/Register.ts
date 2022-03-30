import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User } from 'App/Models'
import { RegisterValidator } from 'App/Validators/User/Register'
import faker from 'faker'
import Mail from '@ioc:Adonis/Addons/Mail'

export default class UserRegisterController {
  public async store({ request }: HttpContextContract) {
    const { email, redirectUrl } = await request.validate(RegisterValidator)
    const user = await User.create({ email })
    await user.save()

    const key = faker.datatype.uuid() + user.id

    user.related('keys').create({ key })

    const link = `${redirectUrl.replace(/\/$/, '')}/${key}`

    // envio

    await Mail.send((message) => {
      message.to(email)
      message.from('contato@fb.com', 'FacebookTest')
      message.subject('New Account')
      message.htmlView('emails/register', { link })
    })
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}
}
