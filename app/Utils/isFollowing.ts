import { User } from 'App/Models'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import Database from '@ioc:Adonis/Lucid/Database'

export const isFollowing = async (user: User, auth: AuthContract) => {
  if (user.id !== auth.user!.id) {
    const isFollowing = await Database.query()
      .from('follows')
      .where('follower_id', auth.user!.id)
      .andWhere('following_id', user.id)
      .first()
    user.$extras.isFollowing = isFollowing ? true : false
  } else {
    user.$extras.isFollowing = null
  }
}
