import Navbar from '@/components/Navbar'
import SignUpForm from '@/components/SignUpForm'
import React from 'react'

type Props = {}

const SignUpPage = (props: Props) => {
  return (
    <div className="min-h-screen flex flex-col bg-black from-gray-50 to-gray-100 ">
      <Navbar />
      <main className="flex-1 flex justify-center items-center p-6">
        <SignUpForm />
      </main>
       <footer className=" text-white py-4">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Cloudbox. All rights reserved.
          </p>
        </div>
      </footer> 
    </div>
  )
}

export default SignUpPage