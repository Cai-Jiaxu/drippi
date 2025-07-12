'use client'

import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import React, { useState, ComponentType, SVGProps } from 'react'
import { WashingMachine, Leaf, Shirt, Shuffle, Upload, DollarSign, Repeat } from 'lucide-react'

interface FeatureCardProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
}

interface HowItWorksStepProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  description: string
}

interface FAQ {
  question: string
  answer: string
}

interface FAQItemProps {
  faq: FAQ
}

export default function Home() {
  const router = useRouter()

  const handleBrowse = () => {
    router.push('/listings')
  }

  const handleList = () => {
    router.push('/upload')
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen">
      <HeroSection handleBrowse={handleBrowse} handleList={handleList} />
      <FeatureSection />
      <HowItWorksSection />
      <FaqSection />
    </div>
  )
}

// ✅ Hero Section Component
function HeroSection({
  handleBrowse,
  handleList,
}: {
  handleBrowse: () => void
  handleList: () => void
}) {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-4 h-screen bg-gradient-to-br from-purple-600 to-blue-500 dark:from-gray-800 dark:to-gray-900 overflow-hidden -mt-10">
      <img
        src="/images/clothing-bg.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-20 -z-10"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-700 to-blue-600 dark:from-gray-700 dark:to-gray-800 opacity-40 -z-10"></div>

      <h1 className="text-7xl leading-[1.3] font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200 dark:from-gray-100 dark:to-gray-300 animate-fade-in">
        DripDaddy
      </h1>
      <p className="max-w-xl text-xl text-gray-200 dark:text-gray-300 mb-10">
        Your campus closet. Rent, wear, and share outfits effortlessly.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={handleBrowse}
          className="bg-white text-purple-600 px-10 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-purple-50 dark:bg-gray-800 dark:text-purple-300 dark:hover:bg-gray-700 transition transform hover:-translate-y-1"
        >
          Browse Outfits
        </Button>

        <Button
          onClick={handleList}
          className="bg-purple-700 text-white px-10 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-purple-800 transition transform hover:-translate-y-1"
        >
          List Your Clothes
        </Button>
      </div>

      <p className="mt-6 text-sm text-gray-200 dark:text-gray-400 max-w-md">
        Empowering students to save money, make money, and reduce fashion waste.
      </p>
    </section>
  )
}

// ✅ Features Section
const features = [
  { icon: Shuffle, title: 'Dare try new style' },
  { icon: Shirt, title: 'Have clothes for all your needs' },
  { icon: WashingMachine, title: 'Reclaim me time, No more laundry' },
  { icon: Leaf, title: 'Fight fast fashion' },
]

function FeatureCard({ icon: Icon, title }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-8 bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition">
      <Icon className="w-16 h-16 mb-4 text-purple-600 dark:text-purple-400" />
      <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{title}</h3>
    </div>
  )
}

function FeatureSection() {
  return (
    <section className="py-24 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <h2 className="text-4xl font-bold text-center mb-16 text-purple-700 dark:text-purple-400">
        Always Have Something New to Wear!
      </h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 px-4">
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} />
        ))}
      </div>
    </section>
  )
}

// ✅ How It Works Section
const steps = [
  {
    icon: Upload,
    title: 'List',
    description: 'Upload your outfit details and set your rental price easily.',
  },
  {
    icon: DollarSign,
    title: 'Rent & Earn',
    description: 'Accept requests and earn money as your clothes get rented.',
  },
  {
    icon: Repeat,
    title: 'Return & Refresh',
    description: 'Get your clothes back, freshened and ready for next rental.',
  },
]

function HowItWorksStep({ icon: Icon, title, description }: HowItWorksStepProps) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-8 rounded-2xl">
      <Icon className="w-16 h-16 mb-4 text-purple-600 dark:text-purple-400" />
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}

function HowItWorksSection() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <h2 className="text-4xl font-bold text-center mb-16 text-purple-700 dark:text-purple-400">
        How It Works
      </h2>
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12 px-4">
        {steps.map((s, i) => (
          <HowItWorksStep key={i} {...s} />
        ))}
      </div>
    </section>
  )
}

// ✅ FAQ Section
const faqs = [
  {
    question: 'How does Drippi work?',
    answer:
      'Drippi is a clothing rental service. You pick a plan, we ship you a box of curated pieces, you wear them as long as you like, then swap them out whenever you’re ready—no commitment to purchase.',
  },
  {
    question: 'How many items can I rent in a month?',
    answer:
      'Each plan comes with a fixed number of items per box and unlimited swaps. For example, our Classic plan gives you 3 items and up to 2 swaps per month.',
  },
  {
    question: 'How long does it take for me to receive my box?',
    answer:
      'Once you place your order, it typically ships within 1–2 business days, and you’ll receive tracking info via email. Delivery time depends on your location but usually arrives in 3–5 days.',
  },
  {
    question: 'What condition are the items in?',
    answer:
      'All pieces are professionally cleaned and inspected after every return. You’ll only ever receive like-new or gently used items that pass our strict quality checks.',
  },
]

function FAQItem({ faq }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-300 dark:border-gray-700">
      <button
        onClick={() => setIsOpen(o => !o)}
        aria-expanded={isOpen}
        className="w-full py-6 text-left flex justify-between items-center focus:outline-none text-gray-800 dark:text-gray-100"
      >
        <span className="font-medium">{faq.question}</span>
        <span className="text-2xl text-purple-600 dark:text-purple-400 transform transition-transform duration-300">
          {isOpen ? '-' : '+'}
        </span>
      </button>
      {isOpen && (
        <p className="px-4 pb-6 text-gray-600 dark:text-gray-300 transition">{faq.answer}</p>
      )}
    </div>
  )
}

function FaqSection() {
  return (
    <section className="bg-white dark:bg-gray-900 py-24">
      <h2 className="text-3xl font-bold text-center mb-12 text-purple-700 dark:text-purple-400">
        FAQs
      </h2>
      <div className="max-w-3xl mx-auto divide-y divide-gray-300 dark:divide-gray-700 px-4">
        {faqs.map((faq, idx) => (
          <FAQItem key={idx} faq={faq} />
        ))}
      </div>
    </section>
  )
}
