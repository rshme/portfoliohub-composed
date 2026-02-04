/**
 * Authentication Types
 * Based on backend API documentation
 */

export interface BackendUser {
  id: string
  email: string
  username: string
  fullName: string
  role: 'user' | 'admin'
  avatarUrl: string | null
  bio: string | null
  socialLinks: {
    github?: string
    linkedin?: string
  } | null
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: BackendUser
  accessToken: string
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
  fullName: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterResponse {
  statusCode: 201
  message: string
  data: AuthResponse
}

export interface LoginResponse {
  statusCode: 200
  message: string
  data: AuthResponse
}
