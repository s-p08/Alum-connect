// src/components/Footer.jsx
import React from 'react';

const Footer = () => (
  <footer className="bg-gray-700">
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
          <p className="text-gray-300">Email: shivamprakash9053@gmail.com</p>
          <p className="text-gray-300">Phone: +91 9053254925</p>
          <p className="text-gray-300">Location: Kurukshetra, Haryana</p>
        </div>
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white">Terms of Service</a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white">KUK Portal</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-white-300 hover:text-white">LinkedIn</a>
            <a href="#" className="text-white-300 hover:text-white">X</a>
            <a href="https://www.instagram.com/" className="text-white-300 hover:text-white">Instagram</a>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-700 pt-8">
        <p className="text-center text-gray-400">&copy; 2026 UIET KURUKSHETRA AlumConnect. All rights reserved.</p>
      </div>
    </div>
    {/* Global styles to override default link styling */}
    {/* <style jsx global>{`
      footer a {
        color: inherit;
        text-decoration: none;
      }
      footer a:visited {
        color: inherit;
      }
    `}</style> */}
    <style jsx global>{`
      footer a {
        color: white;
        text-decoration: none;
      }
      footer a:visited {
        color: white;
      }
    `}</style>
  </footer>
);

export default Footer;
