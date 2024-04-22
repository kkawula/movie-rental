import movies from './movies.js'
 
const mountRoutes = (app) => {
  app.use('/movies', movies)
}
 
export default mountRoutes