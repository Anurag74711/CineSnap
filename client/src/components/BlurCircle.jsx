import { PanelBottomInactiveIcon } from 'lucide-react'
import React from 'react'

const BlurCircle = ({ top, left, right, bottom }) => {
  return (
    <div
      className='absolute -z-50 h-58 w-58 aspect-square rounded-full bg-primary/30 blur-xl'
      style={{ top, left, right, bottom }}
    ></div>
  )
}

export default BlurCircle
