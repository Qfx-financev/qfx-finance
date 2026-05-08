'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'

export default function RegisterPage() {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data:any) => {
    console.log(data)
  }

  return (
    <main className="min-h-screen bg-[#020617] flex items-center justify-center px-6 py-10">
      
      <div className="w-full max-w-lg bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            Open QFX Account
          </h1>

          <p className="text-white/60 mt-3">
            Premium Digital Banking & Crypto Wealth Platform
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <div>
            <label className="text-sm text-white/60">
              Full Name
            </label>

            <input
              {...register('fullName')}
              type="text"
              placeholder="John Doe"
              className="w-full mt-2 p-4 rounded-2xl bg-black/30 border border-white/10 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-white/60">
              Email Address
            </label>

            <input
              {...register('email')}
              type="email"
              placeholder="Enter your email"
              className="w-full mt-2 p-4 rounded-2xl bg-black/30 border border-white/10 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-white/60">
              Password
            </label>

            <input
              {...register('password')}
              type="password"
              placeholder="Create password"
              className="w-full mt-2 p-4 rounded-2xl bg-black/30 border border-white/10 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-white/60">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm password"
              className="w-full mt-2 p-4 rounded-2xl bg-black/30 border border-white/10 text-white"
            />
          </div>

          <button className="w-full bg-blue-500 hover:bg-blue-600 transition-all py-4 rounded-2xl font-semibold text-white">
            Create Account
          </button>

        </form>

        <div className="mt-6 text-center text-white/60">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400">
            Login
          </Link>
        </div>

      </div>

    </main>
  )
}
