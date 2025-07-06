import React from 'react'

const Footer = () => {
  return (
    <>
    <footer className="bg-gray-800 text-white">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">Ready to Digitize Your Restaurant Menu?</h2>
          <p className="mb-6 max-w-2xl mx-auto text-gray-300">
            Join thousands of restaurants already using MenuQR to provide a better dining experience for their customers.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-5 py-2 bg-white text-gray-900 rounded hover:bg-gray-200">Register Your Restaurant</button>
            <button className="px-5 py-2 border border-white rounded hover:bg-white hover:text-gray-900">Contact Sales</button>
          </div>
        </div>
        <div className="bg-gray-900 py-10 px-6 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto text-sm text-gray-300">
            <div>
              <div className="text-white text-lg font-semibold mb-2">🍴 MenuQR</div>
              <p className="mb-4">The easiest way to create and manage digital menus for your restaurant.</p>
              <div className="flex space-x-4 text-xl">
                <i className="fab fa-facebook"></i>
                <i className="fab fa-twitter"></i>
                <i className="fab fa-instagram"></i>
                <i className="fab fa-linkedin"></i>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Features</a></li>
                <li><a href="#" className="hover:underline">Pricing</a></li>
                <li><a href="#" className="hover:underline">Testimonials</a></li>
                <li><a href="#" className="hover:underline">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">About Us</a></li>
                <li><a href="#" className="hover:underline">Blog</a></li>
                <li><a href="#" className="hover:underline">Careers</a></li>
                <li><a href="#" className="hover:underline">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:underline">Terms of Service</a></li>
                <li><a href="#" className="hover:underline">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-500 text-xs mt-8">© 2025 MenuQR. All rights reserved.</div>
        </div>
      </footer>
    </>
  )
}

export default Footer