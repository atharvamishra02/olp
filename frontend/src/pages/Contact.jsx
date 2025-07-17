import React, { useState } from 'react'
import { FaEnvelopeOpenText, FaUser, FaAt, FaCommentDots } from 'react-icons/fa'

const Contact = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setSuccess('Thank you for contacting us! We will get back to you soon.')
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl p-10 mt-8">
        <div className="flex flex-col items-center mb-6">
          <FaEnvelopeOpenText className="text-5xl text-blue-500 mb-2" />
          <h2 className="text-3xl font-extrabold mb-4 text-blue-700">Contact Us</h2>
        </div>
        <p className="mb-6 text-gray-700 text-center">Have questions or feedback? Fill out the form below or email us at <a href="mailto:support@learnx.com" className="text-blue-600 underline">support@learnx.com</a>.</p>
        {success && <div className="mb-4 text-green-600 font-semibold text-center">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400"><FaUser /></span>
              <input type="text" className="w-full border rounded pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-200" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400"><FaAt /></span>
              <input type="email" className="w-full border rounded pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-200" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Message</label>
            <div className="relative">
              <span className="absolute left-3 top-4 text-blue-400"><FaCommentDots /></span>
              <textarea className="w-full border rounded pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-200" rows={4} value={message} onChange={e => setMessage(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 rounded-lg shadow flex items-center justify-center gap-2 transition">Send Message</button>
        </form>
      </div>
    </div>
  )
}

export default Contact 