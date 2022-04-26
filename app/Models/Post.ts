import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  BelongsTo,
  belongsTo,
  hasOne,
  HasOne,
  hasMany,
  HasMany,
  computed
} from '@ioc:Adonis/Lucid/Orm'
import { User, File, Comment, Reaction } from 'App/Models'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public description: string

  @column({ serializeAs: null })
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @hasMany(() => Reaction, { serializeAs: null })
  public reactions: HasMany<typeof Reaction>

  @hasOne(() => File, {
    foreignKey: 'ownerId',
    onQuery: (query) => query.where({ fileCategory: 'post' })
  })
  public media: HasOne<typeof File>

  @computed()
  public get commentsCount() {
    return this.$extras.comments_count
  }

  @computed()
  public get activeReaction() {
    return this.reactions && this.reactions.length ?  this.reactions[0].type : null
  }

  @computed()
  public get reactionsCount() {
    return {
      like: this.$extras.likeCount || 0,
      love: this.$extras.loveCount || 0,
      haha: this.$extras.hahaCount || 0,
      sad: this.$extras.sadCount || 0,
      angry: this.$extras.angryCount || 0
    }
  }
}
