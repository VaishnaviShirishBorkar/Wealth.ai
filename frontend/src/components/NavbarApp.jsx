import React from 'react'
import GradientText from './GradientText'
const Navbar = () => {
  return (
    <div className='border-b border-slate-700 p-4'>
      <h1 className='text-xl font-bold'>
        <GradientText>Wealth AI</GradientText>
      </h1>
    </div>
  )
}

export default Navbar