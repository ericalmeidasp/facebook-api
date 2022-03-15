import Route from '@ioc:Adonis/Core/Route'
import './auth'

Route.get('/', async () => {
  return { hello: 'worldd' }
})

Route.get('/user-register', async ({ view }) => {
  return view.render('emails/register')
})
