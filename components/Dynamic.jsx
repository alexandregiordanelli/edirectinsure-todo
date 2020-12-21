import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(() => import('./TemplateWithState'), {
    ssr: false
})
export default DynamicComponentWithNoSSR