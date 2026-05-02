import React from 'react'
import { BsRobot } from 'react-icons/bs'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-white px-6 md:px-20 py-12">
      
      <div className="grid md:grid-cols-4 gap-10">

        {/* Logo */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gray-100 p-2 rounded-lg">
              <BsRobot className="text-xl text-gray-700" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">MockAI</h2>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed">
            AI-powered interview preparation platform designed to improve 
            communication skills, technical depth, and confidence.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Product</h3>
          <ul className="space-y-2 text-sm text-gray-500">
            <li className="hover:text-green-600 cursor-pointer">Features</li>
            <li className="hover:text-green-600 cursor-pointer">Pricing</li>
            <li className="hover:text-green-600 cursor-pointer">Dashboard</li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Resources</h3>
          <ul className="space-y-2 text-sm text-gray-500">
            <li className="hover:text-green-600 cursor-pointer">Blog</li>
            <li className="hover:text-green-600 cursor-pointer">Help Center</li>
            <li className="hover:text-green-600 cursor-pointer">Support</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Connect</h3>

          <div className="flex gap-4 mb-3">
            <FaGithub className="text-gray-500 hover:text-green-600 cursor-pointer transition" />
            <FaLinkedin className="text-gray-500 hover:text-green-600 cursor-pointer transition" />
            <FaTwitter className="text-gray-500 hover:text-green-600 cursor-pointer transition" />
          </div>

          <p className="text-sm text-gray-500">
            Stay updated with features & interview tips.
          </p>
        </div>

      </div>

      {/* Bottom */}
      <div className="mt-10 pt-6 border-t border-gray-200 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} MockAI. All rights reserved.
      </div>

    </footer>
  )
}

export default Footer