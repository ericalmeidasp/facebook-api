import Route from '@ioc:Adonis/Core/Route'

// 

Route.post('/comments', 'Comments/Main.store').middleware('auth')
Route.put('/comments/:id', 'Comments/Main.update').middleware('auth')

Route.delete('/comments/:id', 'Comments/Main.destroy').middleware('auth')