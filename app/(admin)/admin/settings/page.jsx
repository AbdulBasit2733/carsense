import React from 'react'
import SettingsForm from './components/settings-form'

export const metadata  = {
    title:" Settings | Carsense Admin",
    description:"Manage dealership working hours and admin users",
}

const SettingsPage = () => {
  return (
    <div className='p-6 w-full'>
        <h1 className='text-2xl font-black mb-6'>Settings</h1>
        <SettingsForm />
    </div>
  )
}

export default SettingsPage