import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator, UpdateValidator } from 'App/Validators/Post/Main'
import { Post, User } from 'App/Models'
import fs from 'fs'
import Application from '@ioc:Adonis/Core/Application'

export default class PostsController {
  public async index({ request, auth }: HttpContextContract) {
    const { username } = request.qs()

    const user = username ? await User.findByOrFail('username', username) : auth.user!

    await user.load('posts', (query) => {
      query.orderBy('id', 'desc')

      query.preload('comments', (query) => {
        query.preload('user', (query) => {
          query.select(['id', 'name', 'username'])
          query.preload('avatar')
        })
      })

      query.preload('reactions', () => {
        query.where('userId', auth.user!.id).first()
      })

      query.withCount('comments')

      query.preload('media')

      query.preload('user', (query) => {
        query.select(['id', 'name', 'username'])
        query.preload('avatar')
      })

      // counets reactions
      // likeCount
      query.withCount('reactions', (query) => {
        query.where('type', 'like')
        query.as('likeCount')
      })

      // hahaCount
      query.withCount('reactions', (query) => {
        query.where('type', 'haha')
        query.as('hahaCount')
      })

      // sadCount
      query.withCount('reactions', (query) => {
        query.where('type', 'sad')
        query.as('sadCount')
      })

      // loveCount
      query.withCount('reactions', (query) => {
        query.where('type', 'love')
        query.as('loveCount')
      })

      // angryCount
      query.withCount('reactions', (query) => {
        query.where('type', 'angry')
        query.as('angryCount')
      })

      
    })

    return user.posts
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)
    const post = await auth.user!.related('posts').create(data)

    return post
  }

  public async update({ request, response, params, auth }: HttpContextContract) {
    const data = await request.validate(UpdateValidator)
    const post = await Post.findOrFail(params.id)

    if (auth.user!.id !== post.userId) {
      return response.unauthorized()
    }

    await post.merge(data).save()

    return post
  }

  public async destroy({ response, params, auth }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)

    if (auth.user!.id !== post.userId) {
      return response.unauthorized()
    }

    await post.load('media')

    if (post.media) {
      fs.unlinkSync(Application.tmpPath('uploads', post.media.fileName))

      await post.media.delete()
    }

    await post.delete()
  }
}
