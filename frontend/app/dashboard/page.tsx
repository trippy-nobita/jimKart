'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Header from '../components/header'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { getMembershipDays, getUserProfile } from '../actions/user'

const DAILY_RATE = 200 // 200 rupees per day

export default function Dashboard() {
  const [userId, setUserId] = useState('')
  const [membershipDays, setMembershipDays] = useState(0)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [photoFilename, setPhotoFilename] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('userId')
    if (id) {
      setUserId(id)
      loadUserInfo(id)
    }
  }, [])

  const loadUserInfo = async (id: string) => {
    try {
      const days = await getMembershipDays(id)
      setMembershipDays(days)
      const profile = await getUserProfile(id)
      if (profile) {
        setName(profile.name)
        setBio(profile.bio)
        setPhotoFilename(profile.photoFilename)
      }
    } catch (error) {
      setError('Failed to load user information. Please try refreshing the page.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <Header userId={userId} />
      <main className="container mx-auto px-6 py-8">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
        <div className="bg-white bg-opacity-90 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mr-6">
              {photoFilename ? (
                <Image 
                  src={`/uploads/${photoFilename}`}
                  alt="Profile" 
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No Photo
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {name || 'User'}</h1>
              {bio && <p className="text-gray-600">{bio}</p>}
            </div>
          </div>
          <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700">
            <Link href={`/profile?userId=${userId}`}>Edit Profile</Link>
          </Button>
        </div>
        <div className="bg-white bg-opacity-90 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Current Membership</h2>
          {membershipDays > 0 ? (
            <p className="mb-4">You have {membershipDays} days left in your membership. (Cost: ₹{membershipDays * DAILY_RATE})</p>
          ) : (
            <p className="mb-4">You don't have an active membership.</p>
          )}
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href={`/membership?userId=${userId}`}>
              {membershipDays > 0 ? 'Extend Membership' : 'Purchase Membership'}
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

