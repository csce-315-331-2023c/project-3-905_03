import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

/**
 * This is the main entry point of the React application.
 * 
 * @remarks
 * The `ReactDOM.createRoot` method is used to create a root React fiber. This is where the React application starts.
 * The `React.StrictMode` is a wrapper component that checks for potential problems in the application during the development build.
 * The `App` component is the root component of the application.
 * 
 * @returns The rendered React application
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
