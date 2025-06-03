import express, {
  Application,
  NextFunction,
  Request,
  Response
} from 'express'
import { router } from 'express-file-routing'
import cors from 'cors'
import path from 'path'

import { getToken } from './tokens.js'
import { logger } from './utils.js'

async function auth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth) return next()

  const [type, token] = auth.split(' ')
  if (!type || !token) return next()

  if (type === 'token') {
    const found = await getToken(token, true)
    if (!found) return next()
    req.user = {
      ...found.user,
      token: {
        id: found.id,
        hash: found.hash
      }
    }
  }

  next()
}

export async function setupMiddlewares(app: Application) {
  app.use(cors())
  app.use(express.json())
  app.use(auth)

  app.use(
    '/api',
    await router({
      directory: path.join(process.cwd(), 'dist', 'routes')
    })
  )

  app.use(express.static(path.join(process.cwd(), 'web', 'dist')))
  app.use((req, res) =>
    res.sendFile(path.join(process.cwd(), 'web/dist/index.html'))
  )

  app.use(
    (err: Error, req: Request, res: Response, next: NextFunction) => {
      logger.error(`Error: ${err.message}`, 'Express')
      res.status(500).send()
    }
  )
}
