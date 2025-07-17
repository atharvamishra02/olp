import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaUser, FaBars, FaSearch } from 'react-icons/fa'
import api from '../api'

const Navbar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [allCourses, setAllCourses] = useState([])
  const [allLessons, setAllLessons] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const role = localStorage.getItem('role')
  const dashboardLink = role === 'admin' ? '/admin' : role === 'student' ? '/student' : '/dashboard'
  const dashboardLabel = role === 'admin' ? 'Admin Dashboard' : role === 'student' ? 'Student Dashboard' : 'Dashboard'
  const isLoggedIn = !!localStorage.getItem('token');
  const navigate = useNavigate();

  // Fetch all courses and lessons when search is opened
  const openSearch = async () => {
    setSearchOpen(true)
    setSearchQuery('')
    setSearchResults([])
    if (allCourses.length === 0) {
      setSearchLoading(true)
      try {
        const coursesRes = await api.get('/public/courses')
        setAllCourses(coursesRes.data)
        // Fetch all lessons for all courses
        const lessonsArr = []
        for (const course of coursesRes.data) {
          try {
            const lessonsRes = await api.get(`/public/courses/${course._id}/lessons`)
            for (const lesson of lessonsRes.data) {
              lessonsArr.push({ ...lesson, courseTitle: course.title, courseId: course._id })
            }
          } catch {}
        }
        setAllLessons(lessonsArr)
      } catch {}
      setSearchLoading(false)
    }
  }

  // Filter results as user types
  React.useEffect(() => {
    if (!searchOpen || (!searchQuery && searchQuery !== '')) {
      setSearchResults([])
      return
    }
    const q = searchQuery.toLowerCase()
    const courseResults = allCourses.filter(c => c.title.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q)))
    const lessonResults = allLessons.filter(l => l.title.toLowerCase().includes(q) || (l.content && l.content.toLowerCase().includes(q)))
    setSearchResults([
      ...courseResults.map(c => ({ type: 'course', ...c })),
      ...lessonResults.map(l => ({ type: 'lesson', ...l }))
    ])
  }, [searchQuery, allCourses, allLessons, searchOpen])

  // Handle navigation on result click
  const handleResultClick = (result) => {
    setSearchOpen(false)
    setSearchQuery('')
    setSearchResults([])
    if (result.type === 'course') {
      navigate(`/courses/${result._id}`)
    } else if (result.type === 'lesson') {
      navigate(`/courses/${result.courseId}`)
      // Optionally, scroll to lesson or highlight it
    }
  }

  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center">
      <div className="text-white font-bold text-xl">
        <Link to="/">LearnX</Link>
      </div>
      <div className="flex items-center space-x-4">
        {/* Desktop nav links */}
        <div className="space-x-4 items-center hidden md:flex">
          <Link to="/" className="text-white hover:underline">Home</Link>
          {role === 'admin' && (
            <Link to="/admin" className="text-white hover:underline">Admin Dashboard</Link>
          )}
          {role === 'student' && (
            <Link to="/student" className="text-white hover:underline">Student panel</Link>
          )}
          <Link to="/about" className="text-white hover:underline">About Us</Link>
          <Link to="/contact" className="text-white hover:underline">Contact Us</Link>
        </div>
        {/* Search icon (always visible) */}
        <div className="relative">
          <button className="text-white ml-2" aria-label="Search" onClick={openSearch}>
            <FaSearch size={20} />
          </button>
          {searchOpen && (
            <div className="fixed top-0 left-0 w-full p-2 bg-white z-50 shadow md:absolute md:top-auto md:left-auto md:right-0 md:mt-2 md:w-80 md:rounded md:p-4 md:z-30 md:shadow-lg">
              <input
                autoFocus
                type="text"
                className="w-full border rounded px-3 py-3 mb-2 text-lg md:py-2 md:text-base"
                placeholder="Search courses, lessons..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
              />
              {searchLoading ? (
                <div className="text-gray-500 p-2">Loading...</div>
              ) : (
                <ul className="max-h-60 overflow-y-auto">
                  {searchResults.length === 0 && searchQuery && (
                    <li className="text-gray-500 p-2">No results found.</li>
                  )}
                  {searchResults.map((result, idx) => (
                    <li
                      key={result.type + '-' + result._id + '-' + idx}
                      className="p-2 hover:bg-blue-100 cursor-pointer border-b last:border-b-0"
                      onMouseDown={() => handleResultClick(result)}
                    >
                      {result.type === 'course' ? (
                        <div>
                          <span className="font-semibold">Course:</span> {result.title}
                          <div className="text-xs text-gray-500">{result.description}</div>
                        </div>
                      ) : (
                        <div>
                          <span className="font-semibold">Lesson:</span> {result.title}
                          <div className="text-xs text-gray-500">in {result.courseTitle}</div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        {/* User icon with dropdown (always visible) */}
        <div className="relative">
          <button
            className="text-white focus:outline-none"
            onClick={() => setUserMenuOpen((open) => !open)}
            aria-label="User menu"
          >
            <FaUser size={22} />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg z-10">
              {!isLoggedIn && (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
              {isLoggedIn && (
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100"
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    setUserMenuOpen(false);
                    window.location.href = '/';
                  }}
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
        {/* Hamburger menu for Home and Dashboard (mobile only, rightmost) */}
        <div className="relative md:hidden">
          <button
            className="text-white focus:outline-none"
            onClick={() => setNavOpen((open) => !open)}
            aria-label="Open navigation menu"
          >
            <FaBars size={22} />
          </button>
          {navOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded shadow-lg z-20 flex flex-col md:hidden">
              <Link
                to="/"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-100"
                onClick={() => setNavOpen(false)}
              >
                Home
              </Link>
              {role === 'admin' && (
                <Link
                  to="/admin"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-100"
                  onClick={() => setNavOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              {role === 'student' && (
                <Link
                  to="/student"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-100"
                  onClick={() => setNavOpen(false)}
                >
                  Enroll
                </Link>
              )}
              <Link
                to="/about"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-100"
                onClick={() => setNavOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-100"
                onClick={() => setNavOpen(false)}
              >
                Contact Us
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar 