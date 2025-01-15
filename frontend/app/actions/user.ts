'use server'

import { v4 as uuidv4 } from 'uuid'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

interface UserProfile {
  name: string;
  bio: string;
  photoFilename: string;
}

interface User {
  email: string;
  password: string;
  profile: UserProfile;
  membershipDays: number;
}

interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  amount: number;
}

// This is a mock database. In a real application, you'd use a proper database.
let users: { [key: string]: User } = {}

const validateEmail = (email: string) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return re.test(email)
}

export async function createUser(name: string, email: string, password: string): Promise<string> {
  if (!name.trim()) {
    throw new Error('Name is required')
  }

  if (!validateEmail(email)) {
    throw new Error('Invalid email address')
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long')
  }

  const existingUser = Object.entries(users).find(([_, user]) => user.email === email)
  if (existingUser) {
    throw new Error('User with this email already exists')
  }

  const userId = generateUserId()
  users[userId] = { 
    email, 
    password, 
    profile: { name, bio: '', photoFilename: '' },
    membershipDays: 0
  }
  return userId
}

export async function loginUser(email: string, password: string): Promise<string | null> {
  if (!validateEmail(email)) {
    throw new Error('Invalid email address')
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long')
  }

  const user = Object.entries(users).find(([_, user]) => user.email === email && user.password === password)
  return user ? user[0] : null
}

export async function loginUserById(userId: string, password: string): Promise<boolean> {
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long')
  }

  return users[userId]?.password === password
}

export async function updateUserProfile(userId: string, formData: FormData): Promise<boolean> {
  if (users[userId]) {
    const name = formData.get('name') as string
    const bio = formData.get('bio') as string
    const photo = formData.get('photo') as File | null

    if (photo) {
      try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
        await mkdir(uploadsDir, { recursive: true })

        const buffer = await photo.arrayBuffer()
        const filename = `${userId}-${Date.now()}.${photo.name.split('.').pop()}`
        await writeFile(path.join(uploadsDir, filename), Buffer.from(buffer))
        users[userId].profile.photoFilename = filename
      } catch (error) {
        console.error('Error uploading file:', error)
        throw new Error('Failed to upload profile picture')
      }
    }

    users[userId].profile = {
      ...users[userId].profile,
      name,
      bio,
    }
    return true
  }
  return false
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  return users[userId]?.profile || null
}

export async function purchaseMembership(userId: string, days: number, paymentDetails: PaymentDetails): Promise<boolean> {
  if (users[userId]) {
    // In a real application, you would process the payment here
    // For now, we'll just simulate a successful payment
    const paymentSuccessful = simulatePayment(paymentDetails)

    if (paymentSuccessful) {
      users[userId].membershipDays += days
      return true
    } else {
      throw new Error('Payment failed')
    }
  }
  return false
}

function simulatePayment(paymentDetails: PaymentDetails): boolean {
  // In a real application, you would integrate with a payment gateway here
  // For now, we'll just return true to simulate a successful payment
  console.log('Processing payment:', paymentDetails)
  return true
}

export async function getMembershipDays(userId: string): Promise<number> {
  return users[userId]?.membershipDays || 0
}

export async function removeProfilePicture(userId: string): Promise<boolean> {
  if (users[userId]) {
    users[userId].profile.photoFilename = ''
    return true
  }
  return false
}

function generateUserId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

