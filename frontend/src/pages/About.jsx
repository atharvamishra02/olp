import React from 'react'
import { FaInfoCircle, FaUserGraduate, FaChalkboardTeacher, FaRocket } from 'react-icons/fa'

const About = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 py-12 px-4">
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-10 mt-8">
      <div className="flex flex-col items-center mb-6">
        <FaInfoCircle className="text-5xl text-blue-500 mb-2" />
        <h2 className="text-3xl font-extrabold mb-4 text-blue-700">About Us</h2>
      </div>
      <p className="mb-6 text-gray-700 text-lg text-center">
        <b>LearnX</b> is a modern online learning platform designed to empower students and educators. Our mission is to make high-quality education accessible to everyone, everywhere.
      </p>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <FaUserGraduate className="text-3xl text-purple-500 mt-1" />
          <div>
            <b className="text-lg text-purple-700">For Students:</b>
            <p className="text-gray-700">Browse published courses, enroll, and track your progress through interactive lessons. Our platform is intuitive, responsive, and tailored for your success.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <FaChalkboardTeacher className="text-3xl text-green-500 mt-1" />
          <div>
            <b className="text-lg text-green-700">For Admins:</b>
            <p className="text-gray-700">Easily manage courses and lessons with powerful tools. Create, update, and organize content to deliver the best learning experience.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <FaRocket className="text-3xl text-pink-500 mt-1" />
          <div>
            <b className="text-lg text-pink-700">Our Platform:</b>
            <p className="text-gray-700">Built with the latest technologies, LearnX is secure, scalable, and always improving. Join us on the journey to transform education!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default About 