"use client"

import Link from 'next/link'
import { SparklesCore } from "@/components/ui/sparkles"
import { useState, useEffect } from 'react'

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(0)
  
  const funnyQuotes = [
    "Oops! This page went on vacation without telling us! 🏖️",
    "404: The page you're looking for is probably taking a coffee break ☕",
    "Lost in cyberspace? Don't worry, even GPS gets confused sometimes! 🧭",
    "This page is playing hide and seek... and winning! 👻",
    "Error 404: Page not found. Our bad! 🤷‍♀️"
  ]

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % funnyQuotes.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const searchTerm = e.target.search.value
    if (searchTerm) {
      // You can implement search functionality here
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`
    }
  }

  return (
    <div className="bg-auto h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md relative">
      {/* Sparkles Background */}
      <div className="w-full absolute inset-0 z-10 pointer-events-none">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl animate-bounce">🚀</div>
        <div className="absolute top-32 right-16 text-4xl animate-pulse">⭐</div>
        <div className="absolute bottom-32 left-20 text-5xl animate-spin">🌟</div>
        <div className="absolute bottom-20 right-32 text-3xl animate-bounce">🛸</div>
        <div className="absolute top-48 left-1/3 text-4xl animate-pulse">✨</div>
      </div>

      {/* Main Content */}
      <div className={`flex flex-col items-center justify-center space-y-8 z-30 relative px-4 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        
        {/* Large 404 Display */}
        <div className="flex justify-center w-full text-lg">
          <div className="text-8xl sm:text-9xl font-bold mb-4">
            <span className="drop-shadow-2xl filter">4️⃣💖4️⃣</span>
          </div>
        </div>

        {/* Main Error Message */}
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-pulse">
            Page Not Found
          </h1>
          
          {/* Rotating Funny Quotes */}
          <div className="h-16 flex items-center justify-center">
            <p className="text-lg md:text-xl text-gray-300 transition-opacity duration-500 opacity-100 max-w-lg px-4">
              {funnyQuotes[currentQuote]}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-md">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              name="search"
              placeholder="Search for what you're looking for..."
              className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-white hover:text-blue-400 transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link href="/home">
            <button className="group w-[200px] h-[60px] bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-3 rounded-full transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg hover:shadow-blue-500/25 hover:shadow-2xl transform hover:scale-105">
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-semibold">Back to Home</span>
            </button>
          </Link>
          
          <Link href="/contact">
            <button className="group w-[180px] h-[60px] bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold">Contact Us</span>
            </button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="text-center">
          <p className="text-gray-400 mb-4">Quick Links:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/about" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 hover:underline">
              About Us
            </Link>
            <Link href="/services" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 hover:underline">
              Services
            </Link>
            <Link href="/blog" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 hover:underline">
              Blog
            </Link>
            <Link href="/help" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 hover:underline">
              Help Center
            </Link>
            <Link href="/sitemap" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 hover:underline">
              Site Map
            </Link>
          </div>
        </div>

        {/* Fun Interactive Element */}
        <div className="text-center">
          <button
            onClick={() => window.history.back()}
            className="group text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 border border-gray-600 hover:border-white px-4 py-2 rounded-lg"
          >
            <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Go Back to Previous Page
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-30">
        <p className="text-gray-500 text-sm">
          Lost? Don't worry, even the best explorers get lost sometimes! 🗺️
        </p>
      </div>
    </div>
  )
}