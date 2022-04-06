import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UpdateValidator } from 'App/Validators/User/Avatar'
import Application from '@ioc:Adonis/Core/Application'
import Database from '@ioc:Adonis/Lucid/Database'
import fs from 'fs'

export default class UserAvatarController {
  public async update({ request, auth }: HttpContextContract) {
    const response = await Database.transaction(async (trx) => {
      const { file } = await request.validate(UpdateValidator)
      const user = auth.user!.useTransaction(trx)

      const avatar = await user.related('avatar').firstOrCreate(
        {},
        {
          fileCategory: 'avatar',
          fileName: `${user.username}-${new Date().getTime()}.${file.extname}`
        }
      )

      await file.move(Application.tmpPath('uploads'), {
        name: avatar.fileName,
        overwrite: true
      })

      return avatar
    })
    return response
  }

  public async destroy({ request, auth }: HttpContextContract) {
    await Database.transaction(async (trx) => {
      const user = auth.user!.useTransaction(trx)

      const avatar = await user
        .related('avatar')
        .query()
        .where({ fileCategory: 'avatar' })
        .firstOrFail()

        await avatar.delete()

        fs.unlinkSync(Application.tmpPath('uploads', avatar.fileName))

      return
    })
  }
}
