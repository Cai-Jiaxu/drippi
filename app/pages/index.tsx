// pages/index.tsx
'use client'

import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { WashingMachine,Leaf,Shirt,Shuffle } from 'lucide-react'


export default function Home() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/listings')
  }

  const MainText = () => {
    return <>
      <div className="max-w-xl mx-auto py-20">
          <div className="w-full flex justify-left ">
        <h1
          className="text-7xl font-bold mb-4 p-2 gradient"
        >
          DripDaddy
        </h1>
      </div>
      <p className="text-lg text-[var(--muted-foreground)] text-left mb-8">
        Peer-to-peer outfit rental and sharing made easy. Browse, rent,
        and refresh your wardrobe without the commitment of purchase.
      </p>

    </div>
    </>
       
  }



const features = [
  {
    icon: Shuffle,           
    title: 'Dare try new style',
  },
  {
    icon: Shirt,
    title: 'Have clothes for all your needs',
  },
  {
    icon: WashingMachine ,            
    title: 'Reclaim me time, No more laundry',
    
  },
  {
    icon: Leaf,            
    title: 'Fight fast fashion',
  },
]

function FeatureCard({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center text-center px-4">
      
      <Icon className="w-16 h-16 mb-4 text-blue-500" />

      <h3 className="font-medium text-lg">{title}</h3>

      {subtitle && (
        <p className="mt-2 text-gray-600">
          {subtitle}
        </p>
      )}
    </div>
  )
}


function FeatureSection() {
  return (
    <section className="py-20">
      <h2 className="text-4xl font-semibold text-center mb-12">
        Always Have Something New to Wear!
      </h2>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} />
        ))}
      </div>
    </section>
  )
}




  const faqs = [
  {question: 'How does Drippi work?',
    answer:
      'Drippi is a clothing rental service. You pick a plan, we ship you a box of curated pieces, you wear them as long as you like, then swap them out whenever you’re ready—no commitment to purchase.',},
  {question: 'How many items can I rent in a month?',
    answer:
    'Each plan comes with a fixed number of items per box and unlimited swaps. For example, our Classic plan gives you 3 items and up to 2 swaps per month.',},
  {question: 'How long does it take for me to receive my box?',
    answer:
    'Once you place your order, it typically ships within 1–2 business days, and you’ll receive tracking info via email. Delivery time depends on your location but usually arrives in 3–5 days.',},
  {question: 'What condition are the items in?',
    answer:
    'All pieces are professionally cleaned and inspected after every return. You’ll only ever receive like-new or gently used items that pass our strict quality checks.',},
]

  const FaqSection = () => {
    return (
    <div className="w-full mx-auto py-20 text-center">
      <h2 className="text-3xl font-semibold  mb-8">FAQ</h2>
      <div className="divide-y divide-white-200">
        {faqs.map((faq, idx) => (
          <FAQItem key={idx} faq={faq} />
        ))}
      </div>
    </div>
  )
  }

  function FAQItem({ faq }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(o => !o)}
        className="w-full py-6 text-center focus:outline-none"
      >
        {faq.question}
      </button>

      <button
        onClick={() => setIsOpen(o => !o)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400"
      >
        {isOpen ? "-" : "+"}
      </button>

      {isOpen && (
        <p className="px-4 pb-6 text-white-600">
          {faq.answer}
        </p>
      )}
    </div>
  )
}








  return (
    <div >
      <div className="max-w-xl mx-auto py-20 text-center">
        <MainText />
      
        <Button
        onClick={handleGetStarted}
        variant="outline"
        className="px-6 py-6  text-xl rounded-full font-semibold transition" 
      >
        Get Started
      </Button>
      </div>
      
      <FeatureSection />
      <FaqSection />
    </div>
  )
}


