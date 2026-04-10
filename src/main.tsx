import './main.css'
import { createRoot } from 'react-dom/client'
import FormComponent from './examples/chp-contract/form'

if (import.meta.env.DEV) {
  import('./devtools/ws-client').then(({ installDebugWs }) => installDebugWs());
}

createRoot(document.getElementById('root')!).render(<FormComponent />)
