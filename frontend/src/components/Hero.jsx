import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
    return (
        <><section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16">
            <div className="max-w-xl space-y-6">
                <h1 className="text-4xl font-bold leading-tight">
                    Transform Your Restaurant Menu Into Digital Experience
                </h1>
                <p className="text-gray-600">
                    Create, manage and share your restaurant menu with a simple QR code. No app download required for your customers.
                </p>
                <div className="flex space-x-4">
                    <Link to="/register" >
                    
                    <button className="px-5 py-3 bg-gray-900 text-white rounded hover:bg-gray-700 cursor-pointer">
                        Register Your Restaurant
                    </button>
                    </Link>
                    <button className="px-5 py-3 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer">
                        See How It Works
                    </button>
                </div>
            </div>

            {/* Menu Card */}
            <div className="mt-12 md:mt-0 md:ml-12 bg-gray-800 text-white rounded shadow-lg p-6 w-full max-w-sm">
                <div className="flex justify-between items-center">
                    <div className="font-semibold text-lg">🍴 Cafe Milano</div>
                    <div className="text-xl">🔲</div>
                </div>
                <div className="mt-4">
                    <div className="font-semibold mb-2">Main Courses</div>
                    <div className="space-y-4">
                        <div className="flex justify-between hover:bg-gray-700 p-2 rounded">
                            <div>
                                <div className="font-medium">Margherita Pizza</div>
                                <div className="text-sm text-gray-300">Fresh tomatoes, mozzarella, basil</div>
                            </div>
                            <div>$12.99</div>
                        </div>
                        <div className="flex justify-between hover:bg-gray-700 p-2 rounded">
                            <div>
                                <div className="font-medium">Pasta Carbonara</div>
                                <div className="text-sm text-gray-300">Eggs, cheese, pancetta, black pepper</div>
                            </div>
                            <div>$14.99</div>
                        </div>
                        <div className="flex justify-between hover:bg-gray-700 p-2 rounded">
                            <div>
                                <div className="font-medium">Grilled Salmon</div>
                                <div className="text-sm text-gray-300">With seasonal vegetables</div>
                            </div>
                            <div>$18.99</div>
                        </div>
                    </div>
                    <div className="mt-4 text-center text-sm text-gray-300">Scan to view full menu</div>
                </div>
            </div>
        </section></>
    )
}

export default Hero