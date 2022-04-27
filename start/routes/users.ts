import Route from '@ioc:Adonis/Core/Route'

// registrar user

Route.post('/users/register', 'Users/Register.store')
Route.get('/users/register/:key', 'Users/Register.show')
Route.put('/users/register', 'Users/Register.update')

// recuperar senha

Route.post('/users/forgot', 'Users/ForgotPassword.store')
Route.get('/users/forgot/:key', 'Users/ForgotPassword.show')
Route.put('/users/forgot', 'Users/ForgotPassword.update')

// myProfile

Route.get('/users', 'Users/Main.show').middleware('auth')
Route.put('/users', 'Users/Main.update').middleware('auth')

//avatar - inserir e remover

Route.put('/users/avatar', 'Users/Avatar.update').middleware('auth')
Route.delete('/users/avatar', 'Users/Avatar.destroy').middleware('auth')

//search

Route.get('/users/search', 'Users/Search.index')
