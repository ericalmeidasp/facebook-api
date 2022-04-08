import Route from '@ioc:Adonis/Core/Route'

// show avatar

Route.get('/uploads/:file', 'Uploads/Main.show')
