import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api';
import { FaChalkboardTeacher, FaBookOpen, FaPlusCircle, FaEdit, FaTrash, FaListUl } from 'react-icons/fa'

const AdminDashboard = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [published, setPublished] = useState(false)
  const [courses, setCourses] = useState([])
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [image, setImage] = useState(null);
  const [editCourse, setEditCourse] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPublished, setEditPublished] = useState(false);
  const [editImage, setEditImage] = useState(null);
  const navigate = useNavigate()
  const [lessonModalCourse, setLessonModalCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonVideo, setLessonVideo] = useState(null);
  const [lessonEditId, setLessonEditId] = useState(null);
  const [courseLessons, setCourseLessons] = useState([{ title: '', content: '', video: null }]);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`/api/admin/courses?ts=${Date.now()}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setCourses(data);
    } catch {
      setCourses([]);
    }
  };

  const fetchLessons = async (courseId) => {
    try {
      const res = await api.get(`/admin/courses/${courseId}/lessons`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLessons(res.data);
    } catch {
      setLessons([]);
    }
  };

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line
  }, [success]);

  const handleLessonChange = (idx, field, value) => {
    setCourseLessons(lessons => lessons.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  };
  const handleAddLessonField = () => {
    setCourseLessons(lessons => [...lessons, { title: '', content: '', video: null }]);
  };
  const handleRemoveLessonField = (idx) => {
    setCourseLessons(lessons => lessons.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('published', published);
      if (image) formData.append('image', image);
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to create course')
      // If lessons were added, submit them
      for (const lesson of courseLessons) {
        if (!lesson.title) continue;
        const lessonForm = new FormData();
        lessonForm.append('title', lesson.title);
        lessonForm.append('content', lesson.content);
        if (lesson.video) lessonForm.append('video', lesson.video);
        await fetch(`/api/admin/courses/${data.courseId}/lessons`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: lessonForm
        });
      }
      setSuccess('Course created!')
      setTitle(''); setDescription(''); setPublished(false); setImage(null);
      setCourseLessons([{ title: '', content: '', video: null }]);
      setTimeout(() => navigate('/'), 1000)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (courseId) => {
    setError(''); setSuccess('');
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete course');
      setSuccess('Course deleted!');
      fetchCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = (course) => {
    setEditCourse(course);
    setEditTitle(course.title);
    setEditDescription(course.description);
    setEditPublished(course.published);
    setEditImage(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const formData = new FormData();
      formData.append('title', editTitle);
      formData.append('description', editDescription);
      formData.append('published', editPublished);
      if (editImage) formData.append('image', editImage);
      const res = await fetch(`/api/admin/courses/${editCourse._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update course');
      setSuccess('Course updated!');
      setEditCourse(null);
      fetchCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  const openLessonModal = (course) => {
    setLessonModalCourse(course);
    setLessonTitle('');
    setLessonContent('');
    setLessonVideo(null);
    setLessonEditId(null);
    fetchLessons(course._id);
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', lessonTitle);
      formData.append('content', lessonContent);
      if (lessonVideo) formData.append('video', lessonVideo);
      if (lessonEditId) {
        // Edit lesson
        await api.put(`/admin/lessons/${lessonEditId}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Add lesson
        await api.post(`/admin/courses/${lessonModalCourse._id}/lessons`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      setLessonTitle(''); setLessonContent(''); setLessonVideo(null); setLessonEditId(null);
      fetchLessons(lessonModalCourse._id);
    } catch (err) {
      alert('Failed to save lesson');
    }
  };

  const handleLessonEdit = (lesson) => {
    setLessonTitle(lesson.title);
    setLessonContent(lesson.content || '');
    setLessonVideo(null);
    setLessonEditId(lesson._id);
  };

  const handleLessonDelete = async (lessonId) => {
    try {
      await api.delete(`/admin/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchLessons(lessonModalCourse._id);
    } catch {
      alert('Failed to delete lesson');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 pb-12">
      {/* Hero Section */}
      <div className="max-w-2xl mx-auto py-10 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4 flex items-center justify-center gap-3">
          <FaChalkboardTeacher className="inline-block text-green-500" />
          Admin Dashboard
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
          Manage your courses and lessons with powerful tools and a beautiful interface.
        </p>
      </div>
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">
          <h3 className="text-2xl font-bold mb-4 text-green-800 flex items-center gap-2"><FaPlusCircle className="text-green-400" /> Publish a New Course</h3>
          {error && <div className="mb-2 text-red-500 font-semibold text-center">{error}</div>}
          {success && <div className="mb-2 text-green-600 font-semibold text-center">{success}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Title</label>
              <input type="text" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-200" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-200" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Course Image</label>
              <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
              {image && <div className="text-sm text-gray-600 mt-1">Selected: {image.name}</div>}
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="published" checked={published} onChange={e => setPublished(e.target.checked)} className="mr-2" />
              <label htmlFor="published" className="font-medium">Publish</label>
            </div>
            <button type="submit" className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow flex items-center gap-2 transition"><FaPlusCircle /> Create Course</button>
          </form>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold mb-4 text-blue-800 flex items-center gap-2"><FaBookOpen className="text-purple-400" /> All Published Courses</h3>
          {courses.length === 0 ? (
            <div className="text-gray-500 text-center">No courses found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {courses.filter(course => course.published).map(course => (
                <div key={course._id} className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl shadow p-5 flex flex-col border border-transparent hover:border-blue-300 hover:shadow-lg transition relative">
                  {course.image && <img src={`http://localhost:5000${course.image}`} alt={course.title} className="rounded-xl mb-4 w-full h-32 object-cover" />}
                  <h4 className="text-lg font-bold mb-2 text-blue-700 flex items-center gap-2"><FaBookOpen className="text-purple-400" /> {course.title}</h4>
                  <p className="text-gray-600 mb-4 flex-1">{course.description}</p>
                  <div className="flex flex-col gap-2 mt-auto w-full">
                    <span className="text-green-600 font-semibold">Published</span>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 w-full justify-center"
                      onClick={() => openEditModal(course)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded flex items-center gap-1 w-full justify-center"
                      onClick={() => openLessonModal(course)}
                    >
                      <FaListUl /> Manage Lessons
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center gap-1 w-full justify-center"
                      onClick={() => handleDelete(course._id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Edit Course Modal */}
        {editCourse && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FaEdit className="text-blue-500" /> Edit Course</h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Title</label>
                  <input type="text" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-200" value={editTitle} onChange={e => setEditTitle(e.target.value)} required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Description</label>
                  <textarea className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-200" value={editDescription} onChange={e => setEditDescription(e.target.value)} />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Course Image</label>
                  <input type="file" accept="image/*" onChange={e => setEditImage(e.target.files[0])} />
                  {editCourse.image && !editImage && (
                    <div className="mt-2"><img src={`http://localhost:5000${editCourse.image}`} alt={editCourse.title} className="w-24 h-16 object-cover rounded" /></div>
                  )}
                  {editImage && <div className="text-sm text-gray-600 mt-1">Selected: {editImage.name}</div>}
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="editPublished" checked={editPublished} onChange={e => setEditPublished(e.target.checked)} className="mr-2" />
                  <label htmlFor="editPublished" className="font-medium">Published</label>
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setEditCourse(null)}>Cancel</button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-1"><FaEdit /> Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Manage Lessons Modal */}
        {lessonModalCourse && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FaListUl className="text-purple-500" /> Manage Lessons for {lessonModalCourse.title}</h3>
              <form onSubmit={handleLessonSubmit} className="space-y-4 mb-6">
                <div>
                  <label className="block mb-1 font-medium">Lesson Title</label>
                  <input type="text" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-200" value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Content</label>
                  <textarea className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-200" value={lessonContent} onChange={e => setLessonContent(e.target.value)} />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Video</label>
                  <input type="file" accept="video/*" onChange={e => setLessonVideo(e.target.files[0])} />
                  {lessonVideo && <div className="text-sm text-gray-600 mt-1">Selected: {lessonVideo.name}</div>}
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded" onClick={() => { setLessonTitle(''); setLessonContent(''); setLessonVideo(null); setLessonEditId(null); }}>Cancel</button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-1">{lessonEditId ? <><FaEdit /> Save Changes</> : <><FaPlusCircle /> Add Lesson</>}</button>
                </div>
              </form>
              <h4 className="text-lg font-semibold mb-2 flex items-center gap-2"><FaListUl className="text-purple-500" /> Lessons</h4>
              {lessons.length === 0 && <div className="text-gray-500">No lessons found.</div>}
              <ul>
                {lessons.map(lesson => (
                  <li key={lesson._id} className="mb-4 p-3 border rounded-xl bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between shadow hover:border-blue-300 transition">
                    <div>
                      <span className="font-semibold text-gray-800">{lesson.title}</span>
                      {lesson.video && (
                        <video controls className="w-full md:w-48 mt-2 rounded-xl shadow">
                          <source src={`http://localhost:5000${lesson.video}`} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                      {lesson.content && <div className="mt-2 text-gray-700">{lesson.content}</div>}
                    </div>
                    <div className="flex space-x-2 mt-2 md:mt-0">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1" onClick={() => handleLessonEdit(lesson)}><FaEdit /> Edit</button>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center gap-1" onClick={() => handleLessonDelete(lesson._id)}><FaTrash /> Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard 