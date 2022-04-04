import Route from '@ioc:Adonis/Core/Route'

// registrar

Route.post('/users/register', 'Users/Register.store')
Route.get('/users/register/:key', 'Users/Register.show')
Route.put('/users/register', 'Users/Register.update')

// recuperar senha

Route.post('/users/forgot', 'Users/ForgotPassword.store')
Route.get('/users/forgot/:key', 'Users/ForgotPassword.show')
Route.put('/users/forgot', 'Users/ForgotPassword.update')
