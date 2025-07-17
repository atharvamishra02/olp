import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'
import { FaBookOpen, FaArrowLeft, FaCheckCircle, FaPlayCircle } from 'react-icons/fa'

const CourseDetails = () => {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [enrolled, setEnrolled] = useState(false)
  const [lessons, setLessons] = useState([])
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true)
      setError('')
      try {
        // Fetch all published courses and find the one with this id
        const res = await api.get('/public/courses')
        const found = res.data.find(c => c._id === id)
        setCourse(found)
        // Check user role
        const role = localStorage.getItem('role')
        setIsAdmin(role === 'admin')
        const token = localStorage.getItem('token')
        let isEnrolled = false
        if (role === 'admin' && token) {
          // Admin: fetch all lessons for this course
          const lessonsRes = await api.get(`/admin/courses/${id}/lessons`, { headers: { Authorization: `Bearer ${token}` } })
          setLessons(lessonsRes.data)
          setEnrolled(false)
          setProgress({})
        } else if (token) {
          // Student: check if enrolled
          const enrollmentsRes = await api.get('/student/enrollments', { headers: { Authorization: `Bearer ${token}` } })
          isEnrolled = enrollmentsRes.data.some(e => {
            if (typeof e.course_id === 'object' && e.course_id !== null) {
              return e.course_id._id === id;
            }
            return e.course_id === id;
          });
          setEnrolled(isEnrolled)
          if (isEnrolled) {
            const lessonsRes = await api.get(`/student/courses/${id}/lessons`, { headers: { Authorization: `Bearer ${token}` } })
            setLessons(lessonsRes.data)
            // Fetch progress for each lesson
            const progressObj = {}
            await Promise.all(lessonsRes.data.map(async (lesson) => {
              try {
                const progRes = await api.get(`/student/lessons/${lesson._id}/progress`, { headers: { Authorization: `Bearer ${token}` } })
                progressObj[lesson._id] = progRes.data.completed
              } catch {
                progressObj[lesson._id] = false
              }
            }))
            setProgress(progressObj)
          } else {
            // Not enrolled: fetch public lessons
            const lessonsRes = await api.get(`/public/courses/${id}/lessons`)
            setLessons(lessonsRes.data)
            setProgress({})
          }
        } else {
          // Not logged in: fetch public lessons
          const lessonsRes = await api.get(`/public/courses/${id}/lessons`)
          setLessons(lessonsRes.data)
          setProgress({})
        }
      } catch (err) {
        setError('Failed to load course details')
      }
      setLoading(false)
    }
    fetchCourse()
  }, [id, success])

  const handleEnroll = async () => {
    setError(''); setSuccess('')
    try {
      const token = localStorage.getItem('token')
      await api.post(`/student/courses/${id}/enroll`, {}, { headers: { Authorization: `Bearer ${token}` } })
      setSuccess('Enrolled successfully!')
      setEnrolled(true)
      setTimeout(() => navigate('/student'), 1000)
    } catch (err) {
      setError('Failed to enroll in course')
    }
  }

  // Add this handler for marking lesson as complete
  const handleLessonComplete = async (lessonId) => {
    try {
      const token = localStorage.getItem('token');
      await api.post(`/student/lessons/${lessonId}/progress`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setProgress(prev => ({ ...prev, [lessonId]: true }));
    } catch (err) {
      // Optionally, show error
    }
  };

  // Progress calculation
  const completedCount = Object.values(progress).filter(Boolean).length
  const totalLessons = lessons.length
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const progressWidth = lessons.length > 0
    ? Math.round((Object.values(progress).filter(Boolean).length / lessons.length) * 100)
    : 0;

  if (loading) return <div className="max-w-2xl mx-auto text-center text-blue-600 animate-pulse">Loading...</div>
  if (error) return <div className="max-w-2xl mx-auto text-center text-red-500">{error}</div>
  if (!course) return <div className="max-w-2xl mx-auto text-center text-gray-500">Course not found.</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 pb-12">
      {/* Header Banner */}
      <div className="max-w-2xl mx-auto py-8 px-4 text-center">
        <button
          className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-lg"
          onClick={() => navigate(isAdmin ? '/admin' : '/student')}
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h2 className="text-3xl md:text-4xl font-extrabold text-purple-700 mb-2 flex items-center justify-center gap-2">
          <FaBookOpen className="inline-block text-blue-400" /> {course.title}
        </h2>
        {course.image && <img src={`http://localhost:5000${course.image}`} alt={course.title} className="rounded-xl mb-4 w-full h-56 object-cover shadow-lg mx-auto" />}
        <p className="mb-4 text-gray-700 text-lg">{course.description}</p>
      </div>
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 mb-8">
        {success && <div className="mb-2 text-green-600 font-semibold">{success}</div>}
        {error && <div className="mb-2 text-red-500 font-semibold">{error}</div>}
        {!isAdmin && !enrolled && (
          <button
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow mb-4 transition"
            onClick={handleEnroll}
          >
            Enroll
          </button>
        )}
        {enrolled && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-600">{Object.values(progress).filter(Boolean).length}/{lessons.length} lessons completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div className="bg-green-500 h-3 rounded-full transition-all duration-300" style={{ width: progressWidth + '%' }}></div>
            </div>
          </div>
        )}
        <div>
          <h4 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2"><FaPlayCircle className="text-purple-400" /> Lessons</h4>
          {lessons.length === 0 && <div className="text-gray-500">No lessons found.</div>}
          <ul className="space-y-4">
            {lessons.map(lesson => (
              <li key={lesson._id} className="p-4 border rounded-xl bg-gray-50 shadow flex flex-col gap-2 hover:border-blue-300 transition">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800 flex items-center gap-2">
                    <FaPlayCircle className="text-blue-400" /> {lesson.title}
                  </span>
                  {!isAdmin && enrolled && progress[lesson._id] && <span className="text-green-600 text-xs font-semibold flex items-center gap-1"><FaCheckCircle /> Completed</span>}
                </div>
                {lesson.video && (
                  <video controls className="w-full mt-2 rounded-xl shadow" onEnded={() => {
                    if (!progress[lesson._id]) handleLessonComplete(lesson._id);
                  }}>
                    <source src={`http://localhost:5000${lesson.video}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                {lesson.content && <div className="mt-2 text-gray-700">{lesson.content}</div>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CourseDetails 