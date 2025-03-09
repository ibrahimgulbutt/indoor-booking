import React, { useState } from 'react';
import { FaTrash, FaUpload, FaTimes, FaImage, FaVideo } from 'react-icons/fa';

const MediaManagement = ({ venue, onMediaUpdate }) => {
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [activeTab, setActiveTab] = useState('images');
  
  // State for image upload
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  
  // State for video upload
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [previewVideo, setPreviewVideo] = useState('');

  // Handle image file selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle video file selection
  const handleVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedVideo(file);
      setPreviewVideo(URL.createObjectURL(file));
    }
  };

  // Upload image
  const uploadImage = () => {
    if (selectedImage) {
      // In a real app, you would upload the image to a server
      // Example: await mediaApi.uploadImage(venue.id, selectedImage);
      
      // For now, just add the preview to the venue's images
      const updatedImages = [...venue.images, previewImage];
      onMediaUpdate(venue.id, { images: updatedImages });
      
      // Reset form
      setSelectedImage(null);
      setPreviewImage('');
    }
  };

  // Upload video
  const uploadVideo = () => {
    if (selectedVideo) {
      // In a real app, you would upload the video to a server
      // Example: await mediaApi.uploadVideo(venue.id, selectedVideo);
      
      // For now, just add the preview to the venue's videos
      const updatedVideos = [...venue.videos, previewVideo];
      onMediaUpdate(venue.id, { videos: updatedVideos });
      
      // Reset form
      setSelectedVideo(null);
      setPreviewVideo('');
    }
  };

  // Delete image
  const deleteImage = (index) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      const updatedImages = venue.images.filter((_, i) => i !== index);
      onMediaUpdate(venue.id, { images: updatedImages });
    }
  };

  // Delete video
  const deleteVideo = (index) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      const updatedVideos = venue.videos.filter((_, i) => i !== index);
      onMediaUpdate(venue.id, { videos: updatedVideos });
    }
  };

  return (
    <>
      <button
        onClick={() => setShowMediaModal(true)}
        className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
      >
        <FaImage className="mr-1" /> Manage Media
      </button>

      {/* Media Management Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">
                Manage Media for {venue.name}
              </h3>
              <button 
                onClick={() => {
                  setShowMediaModal(false);
                  setSelectedImage(null);
                  setPreviewImage('');
                  setSelectedVideo(null);
                  setPreviewVideo('');
                }}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700 mb-4">
              <button
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'images' ? 'text-white border-b-2 border-primary-500' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('images')}
              >
                Images
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'videos' ? 'text-white border-b-2 border-primary-500' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('videos')}
              >
                Videos
              </button>
            </div>

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div>
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-white mb-2">Upload New Image</h4>
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
                      <FaImage />
                      <span>Select Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    {previewImage && (
                      <div className="relative">
                        <img src={previewImage} alt="Preview" className="h-20 w-20 object-cover rounded-md" />
                        <button
                          onClick={() => {
                            setSelectedImage(null);
                            setPreviewImage('');
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <button
                      onClick={uploadImage}
                      disabled={!selectedImage}
                      className={`px-4 py-2 rounded-md flex items-center gap-2 ${selectedImage ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
                    >
                      <FaUpload /> Upload
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Supported formats: JPG, PNG, WebP. Max size: 5MB</p>
                </div>

                <h4 className="text-lg font-medium text-white mb-2">Current Images</h4>
                {venue.images.length === 0 ? (
                  <p className="text-gray-400">No images available</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {venue.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`${venue.name} - ${index + 1}`} 
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <button
                          onClick={() => deleteImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Videos Tab */}
            {activeTab === 'videos' && (
              <div>
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-white mb-2">Upload New Video</h4>
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
                      <FaVideo />
                      <span>Select Video</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="hidden"
                      />
                    </label>
                    {previewVideo && (
                      <div className="relative">
                        <video 
                          src={previewVideo} 
                          className="h-20 w-36 object-cover rounded-md" 
                          controls
                        />
                        <button
                          onClick={() => {
                            setSelectedVideo(null);
                            setPreviewVideo('');
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <button
                      onClick={uploadVideo}
                      disabled={!selectedVideo}
                      className={`px-4 py-2 rounded-md flex items-center gap-2 ${selectedVideo ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
                    >
                      <FaUpload /> Upload
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Supported formats: MP4, WebM. Max size: 50MB</p>
                </div>

                <h4 className="text-lg font-medium text-white mb-2">Current Videos</h4>
                {venue.videos.length === 0 ? (
                  <p className="text-gray-400">No videos available</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {venue.videos.map((video, index) => (
                      <div key={index} className="relative group">
                        <video 
                          src={video} 
                          className="w-full h-48 object-cover rounded-md" 
                          controls
                        />
                        <button
                          onClick={() => deleteVideo(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MediaManagement;