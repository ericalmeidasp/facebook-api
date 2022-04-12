import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User } from 'App/Models'
import Database from '@ioc:Adonis/Lucid/Database'
// import Mail from '@ioc:Adonis/Addons/Mail'

export default class SearchController {
  public async index({ request }: HttpContextContract) {
    let keyword = request.qs().keyword.replace(' ', '%')
    

    const search: any = await Database.from('users')
      .select('id')
      .where('name', 'like', `%${keyword}%`)
      .orWhere('username', 'like', `%${keyword}%`)
      .orWhere('email', 'like', `%${keyword}%`)
      .paginate(1, 10)

    const users = await User.findMany(search.rows.map(item => [item.id]))
  
    return users
  }

  public async show({ params }: HttpContextContract) {
    let username = params.username
    
    const user = await User.findByOrFail('username', username)
    await user.load('avatar')
  
    return user
  }
}
