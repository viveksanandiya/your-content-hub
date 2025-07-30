"use client"

import { useRouter } from 'next/navigation';
import { Newspaper, Trophy, Cpu, Heart, Settings, Star, Play, Headphones, Monitor, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Button from "@/components/ui/Button"
import { Router } from "next/router"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const router = useRouter();

  const categories = [
    {
      icon: Newspaper,
      title: "News",
      description: "Stay updated with breaking news, politics, and current events from trusted sources worldwide.",
      color: "bg-red-500",
      items: ["Breaking News", "Politics", "World News", "Local Updates"],
    },
    {
      icon: Play,
      title: "Entertainment",
      description: "Discover movies, TV shows, celebrity news, and the latest entertainment buzz.",
      color: "bg-purple-500",
      items: ["Movies", "TV Shows", "Celebrity News", "Reviews"],
    },
    {
      icon: Headphones,
      title: "Music",
      description: "Explore new releases, artist interviews, concert news, and personalized playlists.",
      color: "bg-green-500",
      items: ["New Releases", "Artist Spotlights", "Concerts", "Playlists"],
    },
    {
      icon: Trophy,
      title: "Sports",
      description: "Get live scores, match highlights, player stats, and sports news coverage.",
      color: "bg-blue-500",
      items: ["Live Scores", "Match Highlights", "Player Stats", "Team News"],
    },
    {
      icon: Monitor,
      title: "Technology",
      description: "Stay ahead with tech news, product reviews, startup stories, and innovation updates.",
      color: "bg-orange-500",
      items: ["Tech News", "Product Reviews", "Startups", "Innovation"],
    },
  ]

  const features = [
    {
      icon: Settings,
      title: "Personalized Feed",
      description: "Choose your preferred content categories and get a customized feed tailored to your interests.",
    },
    {
      icon: Heart,
      title: "Save Favorites",
      description: "Mark articles, videos, and content as favorites to read or watch later at your convenience.",
    },
    {
      icon: Star,
      title: "Smart Recommendations",
      description: "Our AI learns your preferences and suggests content you're most likely to enjoy.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Cpu className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">ContentHub</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors">
                Features
              </Link>
              <Link href="#categories" className="text-sm font-medium hover:text-blue-600 transition-colors">
                Categories
              </Link>
              <Link href="#about" className="text-sm font-medium hover:text-blue-600 transition-colors">
                About
              </Link>
              <Button variant="landing" className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col space-y-4">
                <Link href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors">
                  Features
                </Link>
                <Link href="#categories" className="text-sm font-medium hover:text-blue-600 transition-colors">
                  Categories
                </Link>
                <Link href="#about" className="text-sm font-medium hover:text-blue-600 transition-colors">
                  About
                </Link>
                <div className="pt-4">
                  <Button variant="landing" className="w-full bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950/20 dark:via-background dark:to-blue-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Your Personalized Content Experience
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                  Discover Content That{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Matters to You
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Get personalized news, entertainment, music, sports, and technology content all in one place. Choose
                  your preferences, save favorites, and never miss what you love.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="landing" className="size-lg text-lg px-8 bg-blue-600 hover:bg-blue-700 text-white">
                  Start Personalizing
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span>Live Updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span>AI Powered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                  <span>Ad-Free</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                
                <img src="https://storyset.com/illustration/instant-information/cuate" alt="" width={600}
                  height={600}
                  className="rounded-2xl shadow-2xl" />

              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Content Categories
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold">Everything You Love in One Place</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From breaking news to the latest music releases, we've got all your interests covered. Choose what matters
              to you and get a personalized experience.
            </p>
          </div>

          <div className="bg-white grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <div
                  key={index}
                  className="  group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200 rounded-lg p-6 bg-white"
                >
                  <div className="space-y-4 ">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 rounded-lg ${category.color} text-white group-hover:scale-110 transition-transform`}
                      >
                        
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{category.title}</h3>
                      </div>
                    </div>
                    <p className="text-base text-muted-foreground">{category.description}</p>
                    <div className="flex flex-wrap gap-2 ">
                      {category.items.map((item, itemIndex) => (
                        <span
                          key={itemIndex}
                          className="px-2 py-1 rounded text-xs font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-white">
        <div className="bg-white container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Key Features
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold">Personalization at Its Best</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform learns your preferences and delivers content that matches your interests, while giving you
              full control over your experience.
            </p>
          </div>


{/* ------------ */}
          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={index}
                  className="text-center group hover:shadow-lg transition-all duration-300 p-6 bg-blue-200 rounded-lg"                >
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-base text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-blue-200 to-blue-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8 max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold">Ready to Transform Your Content Experience?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of users who have already personalized their content journey. Start discovering what
              matters to you today.
            </p>

            <div className="flex justify-center">
              <Button variant="landing" className="size-lg text-blue-600 text-lg px-8">
                Get Started Free
              </Button>
            </div>

            <p className="text-sm opacity-70">No credit card required • Free forever plan available</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-gradient-to-r from-blue-200 to-blue-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Cpu className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">ContentHub</span>
              </div>
              <p className="text-muted-foreground">
                Your personalized gateway to news, entertainment, music, sports, and technology.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-blue-600 transition-colors">
                    News
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600 transition-colors">
                    Entertainment
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600 transition-colors">
                    Music
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600 transition-colors">
                    Sports
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600 transition-colors">
                    Technology
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-blue-600 transition-colors">
                    Personalization
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600 transition-colors">
                    Favorites
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600 transition-colors">
                    Recommendations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600 transition-colors">
                    Live Updates
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-blue-600 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600 transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600 transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} ContentHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
