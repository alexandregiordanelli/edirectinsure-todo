import dynamic from 'next/dynamic'
import React from 'react'

const DynamicComponentWithNoSSR = dynamic(() => import('./TemplateWithState'), {
    ssr: false
})
  
export default DynamicComponentWithNoSSR