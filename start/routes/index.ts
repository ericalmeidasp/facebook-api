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

Route.get('/', async () => {
  return { welcome: 'Bemvindo a APIRest de uma bela Rede Social, acesse meu github para mais informações: https://github.com/ericalmeidasp/facebook-api' }
})

Route.on('/test').render('test')

Route.on('/chat').render('chat')

