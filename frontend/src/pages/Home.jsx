import React, { useEffect, useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { FaBookOpen, FaStar } from 'react-icons/fa'

const Home = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await api.get('/public/courses');
        setCourses(res.data)
      } catch (err) {
        setError('Failed to fetch courses')
      }
      setLoading(false)
    }
    fetchCourses()
  }, [])

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 pb-12">
    {/* Hero Section */}
    <div className="max-w-6xl mx-auto py-10 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4 flex items-center justify-center gap-3">
        <FaBookOpen className="inline-block text-purple-500" />
        Welcome to <span className="text-purple-600">LearnX</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
        Discover, enroll, and learn with interactive courses. Track your progress and unlock new skills!
      </p>
    </div>
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 flex items-center gap-2"><FaStar className="text-yellow-400" /> Published Courses</h2>
      {loading ? (
        <div className="text-center text-lg text-blue-600 animate-pulse">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {courses.length === 0 && <div className="text-gray-500 col-span-full text-center">No courses found.</div>}
          {courses.map(course => (
            <div key={course._id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow p-5 flex flex-col border border-transparent hover:border-blue-200 relative group">
              {course.image && <img src={`http://localhost:5000${course.image}`} alt={course.title} className="rounded-xl mb-4 w-full h-40 object-cover group-hover:scale-105 transition-transform" />}
              <h3 className="text-xl font-bold mb-2 text-blue-700 flex items-center gap-2">
                <FaBookOpen className="text-purple-400" /> {course.title}
              </h3>
              <p className="text-gray-600 mb-4 flex-1">{course.description}</p>
              <span className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">Published</span>
              <button
                className="mt-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition"
                onClick={() => navigate(`/courses/${course._id}`)}
              >
                View Course
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)
}

export default Home 