import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator, UpdateValidator } from 'App/Validators/Post/Main'
import { Post, User } from 'App/Models'
import fs from 'fs'
import Application from '@ioc:Adonis/Core/Application'
import { HasMany, LucidModel } from '@ioc:Adonis/Lucid/Orm'

export default class PostsController {
  public async index({ request, auth }: HttpContextContract) {
    const { username } = request.qs()

    const user = username ? await User.findByOrFail('username', username) : auth.user!

    //pega os posts do user.auth ou username

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

   

    // se nao tem username, carrega a timeline principal, com os posts de quem o user segue junto com os dele
    //se tem username, pula esse tela e entrega direto os posts do username solicitado via query
    if (!username) {
      // const user = auth.user!
      // carrega os posts com os users
      await user.load('following', (query) => {
        query.preload('posts', (query) => {
          query.select(['id', 'description', 'createdAt'])

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

          query.preload('media')
          query.preload('user', (query) => {
            query.select(['id', 'name', 'username'])
            query.preload('avatar')
          })
        })
      })

      //Remove a Dupla Array da Requisição

      const allposts = (doubleList: HasMany<typeof Post, LucidModel>[]) => {
        let listingAllPosts: Post[] = []
        doubleList.forEach((element: Post[]) => {
          element.forEach((element) => listingAllPosts.push(element))
        })
        return listingAllPosts
      }

      const getUsersPosts = allposts(user.following.map((user) => user.posts))

      // junta os posts do criador com o dos seguidores

      const joinUsersPostsWithFollowings = [...getUsersPosts, ...user.posts]

      // ordena os posts
      const orderPostsByRecently = joinUsersPostsWithFollowings.sort((a, b) => {
        return b.id - a.id
      })

      return orderPostsByRecently
    } 
    
    return user.posts
        
  }

  public async show({ params }: HttpContextContract) {
    const { postid } = await params

    const post = await Post.query()
      .where({ id: postid })
      .preload('user', (query) => {
        query.select(['id', 'name', 'username'])
        query.preload('avatar')
      })
      .preload('media')
      .preload('comments', (query) =>
        query.preload('user', (query) => {
          query.select(['id', 'name', 'username'])
          query.preload('avatar')
        })
      )
      .withCount('comments')
      .preload('reactions')
      .withCount('reactions', (query) => {
        query.where('type', 'like')
        query.as('likeCount')
      })
      .withCount('reactions', (query) => {
        query.where('type', 'haha')
        query.as('hahaCount')
      })
      .withCount('reactions', (query) => {
        query.where('type', 'sad')
        query.as('sadCount')
      })
      .withCount('reactions', (query) => {
        query.where('type', 'love')
        query.as('loveCount')
      })
      .withCount('reactions', (query) => {
        query.where('type', 'angry')
        query.as('angryCount')
      })

    return post
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)
    const post = await auth.user!.related('posts').create(data)
    await post.load('user', (query) => query.preload('avatar'))
    await post.load('comments', (query) => {
      query.preload('user', (query) => {
        query.select(['id', 'name', 'username'])
        query.preload('avatar')
      })
    })
    
    
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
