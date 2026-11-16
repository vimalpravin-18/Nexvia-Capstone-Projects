import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Plus, 
  Upload, 
  Video, 
  Image as ImageIcon, 
  BookOpen, 
  CheckCircle2, 
  ArrowLeft,
  Sparkles,
  Layers,
  Clock
} from 'lucide-react';

export const CourseBuilderPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('UI/UX Design');
  const [level, setLevel] = useState('Beginner');
  const [price, setPrice] = useState('49.99');
  const [discountPrice, setDiscountPrice] = useState('29.99');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  // Sections and Lessons State
  const [sections, setSections] = useState([
    {
      title: 'Stage 1: Foundational Architecture & Core Concepts',
      lessons: [
        { title: 'Welcome & System Overview', duration: '05:00', type: 'video' }
      ]
    }
  ]);

  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        title: `Stage ${sections.length + 1}: Technical Deep Dive & Application`,
        lessons: [{ title: 'Hands-on Implementation Lesson', duration: '10:00', type: 'video' }]
      }
    ]);
  };

  const handleAddLesson = (sIdx) => {
    const updated = [...sections];
    updated[sIdx].lessons.push({
      title: 'New Video Lesson',
      duration: '10:00',
      type: 'video'
    });
    setSections(updated);
  };

  const handleLessonTitleChange = (sIdx, lIdx, val) => {
    const updated = [...sections];
    updated[sIdx].lessons[lIdx].title = val;
    setSections(updated);
  };

  const handleSectionTitleChange = (sIdx, val) => {
    const updated = [...sections];
    updated[sIdx].title = val;
    setSections(updated);
  };

  // Thumbnail File Upload handler
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('thumbnail', file);

    setUploadingMedia(true);
    setUploadStatus('Uploading thumbnail...');
    try {
      const res = await api.upload('/api/media/upload-thumbnail', formData);
      setThumbnailUrl(res.data.url);
      setUploadStatus('Thumbnail uploaded successfully!');
    } catch (err) {
      alert('Upload failed: ' + err.message);
      setUploadStatus('');
    } finally {
      setUploadingMedia(false);
    }
  };

  // Video File Upload handler
  const handleVideoUpload = async (e, sIdx, lIdx) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('video', file);

    setUploadingMedia(true);
    setUploadStatus(`Uploading video "${file.name}" & triggering FFmpeg background worker...`);
    try {
      const res = await api.upload('/api/media/upload-video', formData);
      const updated = [...sections];
      updated[sIdx].lessons[lIdx].videoUrl = res.data.videoUrl;
      updated[sIdx].lessons[lIdx].cloudFrontUrl = res.data.cloudFrontUrl;
      setSections(updated);
      setUploadStatus(`Video uploaded! Background FFmpeg Job ID: ${res.data.jobId} (Queue: ${res.data.queueType})`);
    } catch (err) {
      alert('Video upload failed: ' + err.message);
      setUploadStatus('');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    if (!title || !description || !category) {
      alert('Please fill in title, description, and category.');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create Course
      const res = await api.post('/api/courses', {
        title,
        subtitle,
        description,
        category,
        level,
        price: parseFloat(price) || 0,
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'
      });

      const newCourseId = res.data.course._id;

      // 2. Create Sections and Lessons
      for (const section of sections) {
        const secRes = await api.post(`/api/courses/${newCourseId}/sections`, {
          title: section.title
        });
        const secId = secRes.data._id;

        for (const lesson of section.lessons) {
          await api.post(`/api/courses/${newCourseId}/sections/${secId}/lessons`, {
            title: lesson.title,
            type: lesson.type,
            videoUrl: lesson.videoUrl || '',
            cloudFrontUrl: lesson.cloudFrontUrl || '',
            durationFormatted: lesson.duration || '10:00'
          });
        }
      }

      alert('Course and curriculum published successfully!');
      navigate('/instructor/dashboard');
    } catch (err) {
      alert('Failed to publish course: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Studio
        </button>

        <span className="badge-pill bg-blue-50 text-blue-700 border border-blue-200">
          Course Creation Wizard
        </span>
      </div>

      <form onSubmit={handleSubmitCourse} className="space-y-8">
        
        {/* Step 1: Basic Information Card */}
        <div className="card-saas p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">1. Course Details & Metadata</h2>
            <p className="text-xs text-slate-400">Define course title, category, pricing, and display thumbnail.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Course Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Advanced System Architecture with Microservices"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Subtitle / Tagline</label>
              <input
                type="text"
                placeholder="A concise, high-impact summary of this masterclass"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Course Description *</label>
              <textarea
                rows={4}
                required
                placeholder="Provide comprehensive details on what students will learn, real-world case studies, and practical projects..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Hardware & Robotics">Hardware & Robotics</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Cloud Architecture">Cloud Architecture</option>
                  <option value="Product Management">Product Management</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Standard Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Discount Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div className="pt-2">
              <label className="font-bold text-slate-800 block mb-1">Course Thumbnail Image</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {thumbnailUrl && (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Thumbnail Ready
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Curriculum & Video Uploads */}
        <div className="card-saas p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">2. Curriculum Stages & Video Lessons</h2>
              <p className="text-xs text-slate-400">Structure modules and upload video content (processed asynchronously via FFmpeg & BullMQ).</p>
            </div>

            <button
              type="button"
              onClick={handleAddSection}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Stage
            </button>
          </div>

          {uploadStatus && (
            <div className="p-3 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs font-mono">
              ⚡ {uploadStatus}
            </div>
          )}

          <div className="space-y-6">
            {sections.map((sec, sIdx) => (
              <div key={sIdx} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 max-w-md">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stage Title</label>
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) => handleSectionTitleChange(sIdx, e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddLesson(sIdx)}
                    className="btn-secondary text-xs py-1.5 px-3 bg-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Lesson
                  </button>
                </div>

                {/* Lessons in Section */}
                <div className="space-y-2 pt-2">
                  {sec.lessons.map((les, lIdx) => (
                    <div key={lIdx} className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 flex-1">
                        <Video className="w-4 h-4 text-blue-600 shrink-0" />
                        <input
                          type="text"
                          value={les.title}
                          onChange={(e) => handleLessonTitleChange(sIdx, lIdx, e.target.value)}
                          placeholder="Lesson Title"
                          className="flex-1 p-1.5 border border-slate-100 rounded focus:outline-none focus:border-blue-400 text-xs"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleVideoUpload(e, sIdx, lIdx)}
                          className="text-[11px] file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                        />
                        {les.videoUrl ? (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200 shrink-0">
                            ✓ Ready
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                            Demo Video
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => navigate('/instructor/dashboard')}
            className="btn-secondary text-sm py-2.5 px-6"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary text-sm py-2.5 px-8 shadow-lg shadow-blue-500/20"
          >
            {submitting ? 'Publishing Course...' : 'Publish Course & Curriculum'}
          </button>
        </div>
      </form>
    </div>
  );
};
