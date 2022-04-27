import Route from '@ioc:Adonis/Core/Route'

Route.get('/profiles/:username', 'Profiles/Main.show').middleware('auth')
