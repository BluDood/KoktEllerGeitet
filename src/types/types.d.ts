declare namespace Express {
  export interface Request {
    user?: User & { token: Token }
  }
}

interface User {
  id: string
  username: string
  type: 'user' | 'admin'
}

interface Token {
  id: string
  hash: string
}
