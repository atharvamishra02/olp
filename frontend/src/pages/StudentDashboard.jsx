import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { FaUserGraduate, FaBookOpen, FaCheckCircle, FaPlusCircle } from 'react-icons/fa'

const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [availableCourses, setAvailableCourses] = useState([])
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Fetch enrolled and available courses
  const fetchCourses = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const [enrolledRes, availableRes] = await Promise.all([
        api.get('/student/enrollments', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/public/courses')
      ])
      setEnrolledCourses(enrolledRes.data)
      setAvailableCourses(availableRes.data)
    } catch (err) {
      setError('Failed to fetch courses')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCourses()
    // eslint-disable-next-line
  }, [success])

  const handleEnroll = async (courseId) => {
    setError(''); setSuccess('')
    try {
      const token = localStorage.getItem('token')
      await api.post(`/student/courses/${courseId}/enroll`, {}, { headers: { Authorization: `Bearer ${token}` } })
      setSuccess('Enrolled successfully!')
      fetchCourses()
    } catch (err) {
      setError('Failed to enroll in course')
    }
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 pb-12">
    {/* Hero Section */}
    <div className="max-w-2xl mx-auto py-10 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4 flex items-center justify-center gap-3">
        <FaUserGraduate className="inline-block text-purple-500" />
        Welcome, Student!
      </h1>
      <p className="text-lg md:text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
        Here are your enrolled and available courses. Keep learning and growing!
      </p>
    </div>
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <h3 className="text-2xl font-bold mb-4 text-blue-800 flex items-center gap-2"><FaBookOpen className="text-yellow-400" /> Enrolled Courses</h3>
        {loading ? <div className="text-center text-lg text-blue-600 animate-pulse">Loading...</div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {enrolledCourses.length === 0 && <div className="text-gray-500 col-span-full text-center">You are not enrolled in any courses.</div>}
            {enrolledCourses.map(enrollment => {
              const course = enrollment.course_id;
              return (
                <div key={enrollment._id} className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl shadow p-4 flex flex-col border border-transparent hover:border-blue-300 hover:shadow-lg transition relative">
                  {course && course.image && (
                    <img
                      src={`http://localhost:5000${course.image}`}
                      alt={course.title}
                      className="rounded mb-4 w-full h-32 object-cover"
                    />
                  )}
                  <h4 className="text-lg font-bold mb-2 text-blue-700 flex items-center gap-2"><FaBookOpen className="text-purple-400" /> {course ? course.title : ''}</h4>
                  <p className="text-gray-600 mb-4 flex-1">{course ? course.description : ''}</p>
                  <div className="flex items-center space-x-2 mt-auto">
                    <button
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-1 px-3 rounded-lg shadow flex items-center gap-2 transition"
                      onClick={() => navigate(`/courses/${course ? course._id : ''}`)}
                    >
                      <FaCheckCircle /> View Course
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <h3 className="text-2xl font-bold mb-4 text-green-800 flex items-center gap-2"><FaPlusCircle className="text-green-400" /> Available Courses</h3>
        {loading ? <div className="text-center text-lg text-blue-600 animate-pulse">Loading...</div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {availableCourses.length === 0 && <div className="text-gray-500 col-span-full text-center">No available courses found.</div>}
            {availableCourses.map(course => (
              <div key={course._id} className="bg-gradient-to-br from-green-100 to-blue-100 rounded-xl shadow p-4 flex flex-col border border-transparent hover:border-green-300 hover:shadow-lg transition relative">
                {course.image && (
                  <img
                    src={`http://localhost:5000${course.image}`}
                    alt={course.title}
                    className="rounded mb-4 w-full h-32 object-cover"
                  />
                )}
                <h4 className="text-lg font-bold mb-2 text-green-700 flex items-center gap-2"><FaBookOpen className="text-blue-400" /> {course.title}</h4>
                <p className="text-gray-600 mb-4 flex-1">{course.description}</p>
                <div className="flex items-center space-x-2 mt-auto">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold py-1 px-3 rounded-lg shadow flex items-center gap-2 transition"
                    onClick={() => navigate(`/courses/${course._id}`)}
                  >
                    <FaBookOpen /> View Course
                  </button>
                  <button
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-1 px-3 rounded-lg shadow flex items-center gap-2 transition"
                    onClick={() => handleEnroll(course._id)}
                    disabled={enrolledCourses.some(e => e._id === course._id)}
                  >
                    <FaPlusCircle /> {enrolledCourses.some(e => e._id === course._id) ? 'Enrolled' : 'Enroll'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <div className="mb-2 text-red-500 text-center font-semibold">{error}</div>}
      {success && <div className="mb-2 text-green-600 text-center font-semibold">{success}</div>}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
        <button
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
          onClick={fetchCourses}
        >
          Refresh
        </button>
        <button
          className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
          onClick={() => navigate('/')}
        >
          Go to Home
        </button>
      </div>
    </div>
  </div>
)
}

export default StudentDashboard 