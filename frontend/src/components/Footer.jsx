import React from 'react'

const Footer = () => {
  return (
    <div className='bg-gradient-to-r from-indigo-900 via-blue-800 to-sky-700 h-64 flex items-center justify-center flex-col'>
        <h1 className='text-5xl text-white font-bold'>
            Ready to transform your finances?
        </h1>
        <p className='text-lg text-white mt-6'>
            Join thousands of users who are already saving smarter with AI-powered insights.
        </p>
        <button className="bg-white text-blue-700 font-medium px-6 py-3 rounded-lg hover:bg-slate-100 mt-6">
              Get Started
        </button>
    </div>
  )
}

export default Footer