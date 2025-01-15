'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '../components/header'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getUserProfile, updateUserProfile, removeProfilePicture } from '../actions/user'

export default function Profile() {
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [photoFilename, setPhotoFilename] = useState('')
  const [userId, setUserId] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('userId')
    if (id) {
      setUserId(id)
      loadUserProfile(id)
    } else {
      router.push('/login')
    }
  }, [router])

  const loadUserProfile = async (id: string) => {
    try {
      const profile = await getUserProfile(id)
      if (profile) {
        setName(profile.name)
        setBio(profile.bio)
        setPhotoFilename(profile.photoFilename)
      }
    } catch (error) {
      setError('Failed to load user profile. Please try again.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('bio', bio)
      formData.append('photoFilename', photoFilename)
      if (photoFile) {
        formData.append('photo', photoFile)
      }

      const success = await updateUserProfile(userId, formData)
      if (success) {
        alert('Profile updated successfully!')
        loadUserProfile(userId)
        setPhotoFile(null)
      } else {
        setError('Failed to update profile. Please try again.')
      }
    } catch (error) {
      setError('An error occurred while updating the profile. Please try again.')
    }
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0])
    }
  }

  const handleRemovePhoto = async () => {
    try {
      const success = await removeProfilePicture(userId)
      if (success) {
        setPhotoFilename('')
        setPhotoFile(null)
        alert('Profile picture removed successfully!')
      } else {
        setError('Failed to remove profile picture. Please try again.')
      }
    } catch (error) {
      setError('An error occurred while removing the profile picture. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <Header userId={userId} />
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="bg-white bg-opacity-90 rounded-lg shadow-md p-6 max-w-md mx-auto">
          <div className="mb-6 flex flex-col items-center">
            <div 
              className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 cursor-pointer"
              onClick={handlePhotoClick}
            >
              {(photoFile || photoFilename) && (
                <Image 
                  src={photoFile ? URL.createObjectURL(photoFile) : `/uploads/${photoFilename}`}
                  alt="Profile" 
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
            <div className="mt-2 space-x-2">
              <Button type="button" variant="outline" onClick={handlePhotoClick}>
                Upload Photo
              </Button>
              {(photoFile || photoFilename) && (
                <Button type="button" variant="destructive" onClick={handleRemovePhoto}>
                  Remove Photo
                </Button>
              )}
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Update Profile</Button>
        </form>
      </main>
    </div>
  )
}

