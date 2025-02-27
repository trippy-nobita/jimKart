'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {

  return (
     <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex flex-col items-center justify-center">
       <div className="text-center">
         <h1 className="text-4xl font-bold text-white mb-8">Welcome to jimKart</h1>
         <p className="text-xl text-white mb-8">Access gyms in different cities during your travels</p>
         <div className="space-x-4">
           <Button asChild>
             <Link href="/signup">Sign Up</Link>
           </Button>
           <Button asChild variant="outline">
             <Link href="/login">Login</Link>
           </Button>
         </div>
       </div>
     </div>
   )
}

