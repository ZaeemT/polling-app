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
    imageUrl: string
    originalImageSize: number
    optimizedImageSize: number
    options: { text: string; votes: number }[]
    creator: string
    isActive: boolean
    createdAt?: Date
    anonymousVotes: string[]
    userVotes: string[]
}

export interface AuthState {
    user: User | null
    token: string | null
}