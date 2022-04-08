import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import { User } from 'App/Models'
import Database from '@ioc:Adonis/Lucid/Database'
// import Mail from '@ioc:Adonis/Addons/Mail'

export default class SearchController {
  public async index({ request }: HttpContextContract) {

    let keyword = request.qs().keyword
    keyword = keyword.replace(' ','%')
    const users = await Database.from('users').select('*').where('name', 'like', `%${keyword}%`).paginate(1,10)
    
    return users
  }
}
