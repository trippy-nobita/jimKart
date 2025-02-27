import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Header({ userId }: { userId: string }) {
  return (
    <header className="bg-white bg-opacity-90 shadow-md">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">jimKart</Link>
        <div className="space-x-4">
          <Button asChild variant="ghost" className="text-blue-600 hover:text-blue-800">
            <Link href={`/dashboard?userId=${userId}`}>Dashboard</Link>
          </Button>
          <Button asChild variant="ghost" className="text-blue-600 hover:text-blue-800">
            <Link href={`/profile?userId=${userId}`}>Profile</Link>
          </Button>
          <Button asChild variant="ghost" className="text-blue-600 hover:text-blue-800">
            <Link href={`/membership?userId=${userId}`}>Membership</Link>
          </Button>
          <Button asChild variant="outline" className="text-blue-600 hover:text-blue-800">
            <Link href="/">Logout</Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}

