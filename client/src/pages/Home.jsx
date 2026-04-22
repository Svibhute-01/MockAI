import React from 'react'

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Tailwind Test 🚀
        </h1>

        <p className="text-gray-600 mb-6">
          If this card looks styled, Tailwind is working perfectly.
        </p>

        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition">
          Click Me
        </button>

      </div>
    </div>
  )
}

export default Home