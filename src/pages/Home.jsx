import React from 'react'
import PurityManager from '../components/PurityManager'
import MetalRateManager from '../components/MetalRateManager'

function Home() {
  return (
    <div className='main p-8'>
        <PurityManager />
        <MetalRateManager />
    </div>
  )
}

export default Home