import Route from '@ioc:Adonis/Core/Route'
import './auth'
import './users'
import './uploads'
import './posts'
import './comments'
import './reactions'
import './follows'
import './profiles'
import './messages'
import './conversation'

Route.on('/').render('welcome')

Route.on('/test').render('test')

Route.on('/chat').render('chat')

