export interface User {
    id?: string
    username: string
    email: string
    createdAt?: Date
}



export interface Poll {
    id?: string
    title: string
    description: string
    image: string
    originalImageSize: number
    optimizedImageSize: number
    options: { text: string; votes: number }[]
    user_id: string
    isActive: boolean
    createdAt?: Date
    anonymousVotes: string[]
    userVotes: string[]
}

export interface AuthState {
    user: User | null
    token: string | null
}