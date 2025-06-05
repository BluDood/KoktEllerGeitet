import { z } from 'zod'

export const username = z.string().min(3).max(32)
export const password = z.string().min(8)
export const id = z.string().max(32)

export const loginSchema = z.object({
  username,
  password
})

export const registerSchema = z.object({
  username,
  password
})

export const updateUserSchema = z.object({
  username
})

export const idSchema = z.object({
  id
})

export const createRecipeSchema = z.object({
  name: z.string().min(1).max(64),
  image: z.string().url(),
  description: z.string().min(1).max(128),
  ingredients: z.array(z.string().min(1).max(64)).min(1).max(16),
  instructions: z.string().min(1).max(8192),
  category: z.string().min(1).max(32),
  tastes: z.array(z.string().min(1).max(16)).min(1).max(5)
})

export const updateRecipeSchema = z.object({
  name: z.string().min(1).max(64).optional(),
  image: z.string().url().optional(),
  description: z.string().min(1).max(128).optional(),
  ingredients: z
    .array(z.string().min(1).max(64))
    .min(1)
    .max(16)
    .optional(),
  instructions: z.string().min(1).max(8192).optional(),
  category: z.string().min(1).max(32).optional(),
  tastes: z.array(z.string()).min(1).max(16).optional()
})

export const searchRecipeSchema = z.object({
  query: z.string().min(1).max(64)
})

export const createMenuSchema = z.object({
  name: z.string().min(1),
  occasions: z.array(z.string()).min(1).max(16)
})

export const updateMenuSchema = z.object({
  name: z.string().min(1).optional(),
  occasions: z.array(z.string()).min(1).max(16).optional(),
  recipes: z.array(id).optional()
})
