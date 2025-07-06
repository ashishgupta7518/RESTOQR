import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
   <><nav className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-semibold">🍴 MenuQR</span>
        </div>
        <div className="space-x-6 hidden md:flex">
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#" className="hover:text-blue-600">Features</a>
          <a href="#" className="hover:text-blue-600">Pricing</a>
          <a href="#" className="hover:text-blue-600">Contact</a>
        </div>
        <div className="space-x-2">
            <Link to="/login">
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer">Log in</button></Link>
          <button className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700 cursor-pointer">Sign up</button>
        </div>
      </nav>
   </>
  )
}

export default Navbar