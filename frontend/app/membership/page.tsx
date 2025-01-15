'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../components/header'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { purchaseMembership } from '../actions/user'

const DAILY_RATE = 200 // 200 rupees per day

export default function Membership() {
  const [days, setDays] = useState('')
  const [userId, setUserId] = useState('')
  const [totalCost, setTotalCost] = useState(0)
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('userId')
    if (id) {
      setUserId(id)
    } else {
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    setTotalCost(Number(days) * DAILY_RATE)
  }, [days])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!days || Number(days) <= 0) {
      setError('Please enter a valid number of days.')
      return
    }

    if (!cardNumber || !expiryDate || !cvv) {
      setError('Please fill in all payment details.')
      return
    }

    try {
      const success = await purchaseMembership(userId, Number(days), {
        cardNumber,
        expiryDate,
        cvv,
        amount: totalCost
      })
      if (success) {
        alert(`Successfully purchased ${days} days of membership for ₹${totalCost}!`)
        router.push(`/dashboard?userId=${userId}`)
      } else {
        setError('Failed to purchase membership. Please try again.')
      }
    } catch (error) {
      console.error('Error purchasing membership:', error)
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <Header userId={userId} />
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Purchase Membership</h1>
        <form onSubmit={handleSubmit} className="bg-white bg-opacity-90 rounded-lg shadow-md p-6 max-w-md mx-auto">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
          <div className="mb-4">
            <Label htmlFor="days">Number of Days</Label>
            <Input
              id="days"
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              required
              min="1"
            />
          </div>
          <div className="mb-4">
            <p className="text-lg font-semibold">Total Cost: ₹{totalCost}</p>
          </div>
          <div className="mb-4">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
              placeholder="1234 5678 9012 3456"
            />
          </div>
          <div className="mb-4 flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
                placeholder="MM/YY"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
                placeholder="123"
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Purchase Membership</Button>
        </form>
      </main>
    </div>
  )
}

