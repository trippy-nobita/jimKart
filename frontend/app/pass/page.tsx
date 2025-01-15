import Header from '../components/header'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function Pass({ searchParams }: { searchParams: { days: string, passId: string, userId: string } }) {
  const { days, passId, userId } = searchParams

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Your jimKart Pass</h1>
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Membership Details</h2>
          <p className="mb-2">User ID: {userId}</p>
          <p className="mb-2">Pass ID: {passId}</p>
          <p className="mb-4">You have purchased a {days}-day membership.</p>
          <p className="mb-4">Your pass is valid for use at any jimKart affiliated gym in your current city.</p>
          <Button asChild>
            <Link href={`/dashboard?userId=${userId}`}>Return to Dashboard</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

