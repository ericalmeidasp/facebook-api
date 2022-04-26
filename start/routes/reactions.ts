import Route from '@ioc:Adonis/Core/Route'

// reaçóes

Route.put('/reactions', 'Reactions/Main.update').middleware('auth')

Route.delete('/reactions/:id', 'Reactions/Main.destroy').middleware('auth')