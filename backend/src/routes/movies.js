import Router from 'express-promise-router'
import { query } from '../db/index.js'
 
const router = new Router()
export default router
 
router.get('/:id', async (req, res) => {
  const { id } = req.params
  const { rows } = await query('SELECT * FROM movies WHERE id = $1', [id])
  res.send(rows[0])
})