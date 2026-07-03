import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import connectLogo from "../../assets/connect_logo_black.svg";

// EDIT YOUR INFO ONCE HERE - IT UPDATES EVERYWHERE (DESKTOP & MOBILE)
const contactData = {
  description: "I am committed to creating lasting relationships that connect alumni with their alma mater and current students. Whether you are an alumnus looking to give back or a student seeking guidance, I am here to support you.",
  members: [
    {
      name: "Shivam Prakash",
      linkedin: "https://www.linkedin.com/in/shivam-prakash-772727306",
      instagram: "https://www.instagram.com/",
      contact: "+91 9053254925"
    }
  ],
  general: {
    email: "shivamprakash9053@gmail.com",
    phone: "+91 9053254925"
  }
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileAbout, setMobileAbout] = useState(false);
  const [mobileContact, setMobileContact] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 flex-wrap bg-white border-b border-gray-100">
        {/* Logo */}
        <div className="logo flex items-center flex-shrink-0">
          <Link to="/" className="flex items-center">
            <img
              src={connectLogo}
              width="80"
              height="60"
              alt="Logo"
            />
            <h1 className="ml-2 text-2xl font-bold text-blue-600 hidden lg:block">
              Alum Connect
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8 flex-1 justify-end">
          <ul className="flex items-center space-x-8">
            <li>
              <Link to="/" className="text-gray-700 hover:text-gray-900">
                Home
              </Link>
            </li>

            {/* About Link with Hover Dropdown */}
            <li className="relative group">
              <span className="text-gray-700 hover:text-gray-900 cursor-pointer">
                About
              </span>
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-96 p-6 bg-white border border-gray-100 shadow-md rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    About the Platform
                  </h2>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  This platform is a dedicated alumni networking space,
                  focused on bridging the gap between alumni and their alma mater.
                  We aim to create meaningful connections that will strengthen the bond between alumni, current
                  students, and the institution.
                </p>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">Mission</h3>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  To empower UIET KURUKSHETRA alumni to stay connected with their
                  college and juniors, fostering a collaborative network where
                  knowledge, experiences, and opportunities can be shared freely.
                </p>
              </div>
            </li>

            {/* Contact Link with Hover Dropdown */}
            <li className="relative group">
              <span className="text-gray-700 hover:text-gray-900 cursor-pointer">
                Contact
              </span>
              <div className="absolute right-1/2 transform translate-x-1/2 top-full mt-2 w-96 p-6 bg-white border border-gray-100 shadow-md rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Get in Touch with Us
                  </h2>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  {contactData.description}
                </p>

                {contactData.members.map((member, idx) => (
                  <p key={idx} className="mt-4 text-sm text-gray-600">
                    <strong>{member.name}</strong>
                    <br />
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">LinkedIn</a>
                    {' | '}
                    <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Instagram</a>
                    <br />
                    Contact: {member.contact}
                  </p>
                ))}

                <p className="mt-4 text-sm text-gray-600 border-t pt-4">
                  Email: {contactData.general.email}
                  <br />
                  Phone: {contactData.general.phone}
                </p>
              </div>
            </li>
          </ul>
          {/* Sign In Button */}
          <div className="button-container ml-4">
            <Link
              to="/login"
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="px-4 py-4 space-y-4">
            <ul className="space-y-4">
              <li>
                <Link to="/" className="block text-gray-700 hover:text-blue-600 text-lg">Home</Link>
              </li>
              <li>
                <button
                  onClick={() => setMobileAbout(!mobileAbout)}
                  className="w-full flex justify-between items-center text-gray-700 hover:text-blue-600 text-lg focus:outline-none"
                >
                  <span>About</span>
                  <ChevronDown className={`transition-transform ${mobileAbout ? 'rotate-180' : ''}`} size={20} />
                </button>
                {mobileAbout && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      We are a passionate team dedicated to connecting alumni with their alma mater.
                    </p>
                  </div>
                )}
              </li>
              <li>
                <button
                  onClick={() => setMobileContact(!mobileContact)}
                  className="w-full flex justify-between items-center text-gray-700 hover:text-blue-600 text-lg focus:outline-none"
                >
                  <span>Contact</span>
                  <ChevronDown className={`transition-transform ${mobileContact ? 'rotate-180' : ''}`} size={20} />
                </button>
                {mobileContact && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold mb-2">Get in Touch</p>
                    <p className="text-xs text-gray-500 mb-4">{contactData.description}</p>
                    {contactData.members.map((member, idx) => (
                      <div key={idx} className="mb-4">
                        <p className="text-sm font-bold text-gray-800">{member.name}</p>
                        <div className="flex space-x-3 text-xs">
                          <a href={member.linkedin} className="text-blue-500 underline">LinkedIn</a>
                          <a href={member.instagram} className="text-blue-500 underline">Instagram</a>
                        </div>
                        <p className="text-xs text-gray-500">Contact: {member.contact}</p>
                      </div>
                    ))}
                  </div>
                )}
              </li>
              <li className="pt-2">
                <Link to="/login" className="block w-full text-center px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
