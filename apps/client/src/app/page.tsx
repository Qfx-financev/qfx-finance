import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold mb-6">
        QFX Finance
      </h1>

      <p className="text-xl text-gray-400 mb-10">
        Premium Digital Banking & Crypto Investment Platform
      </p>

      <div className="flex gap-6">
        <Link
          href="/login"
          className="bg-blue-600 px-8 py-4 rounded-xl"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="border border-white px-8 py-4 rounded-xl"
        >
          Open Account
        </Link>
      </div>
    </main>
  )
}
