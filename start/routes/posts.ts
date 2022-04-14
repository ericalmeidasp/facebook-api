import Route from '@ioc:Adonis/Core/Route'

// 

Route.resource('/posts', 'Posts/Main').apiOnly().except(['show']).middleware({
    store: ['auth'],
    update: ['auth'],
    destroy: ['auth']
})