import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaPlay, FaExpand, FaPause } from 'react-icons/fa';

const VenueMediaModal = ({ isOpen, onClose, venue }) => {
  const [activeTab, setActiveTab] = useState('images');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef(null);
  const modalRef = useRef(null);

  // Reset video state when changing tabs or videos
  useEffect(() => {
    setIsPlaying(false);
    setVideoProgress(0);
  }, [activeTab, currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'Escape':
          onClose();
          break;
        case ' ': // Space bar
          if (activeTab === 'videos') {
            togglePlayPause();
            e.preventDefault();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeTab, currentIndex]);

  // Handle video progress updates
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const updateProgress = () => {
      const progress = (videoElement.currentTime / videoElement.duration) * 100;
      setVideoProgress(progress || 0);
      setIsPlaying(!videoElement.paused);
    };

    videoElement.addEventListener('timeupdate', updateProgress);
    videoElement.addEventListener('play', () => setIsPlaying(true));
    videoElement.addEventListener('pause', () => setIsPlaying(false));
    videoElement.addEventListener('ended', () => {
      setIsPlaying(false);
      setVideoProgress(0);
    });

    return () => {
      videoElement.removeEventListener('timeupdate', updateProgress);
      videoElement.removeEventListener('play', () => setIsPlaying(true));
      videoElement.removeEventListener('pause', () => setIsPlaying(false));
      videoElement.removeEventListener('ended', () => {
        setIsPlaying(false);
        setVideoProgress(0);
      });
    };
  }, [activeTab, currentIndex]);

  if (!isOpen || !venue) return null;

  const media = activeTab === 'images' ? venue.images : venue.videos;
  const hasMedia = media && media.length > 0;

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? media.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === media.length - 1 ? 0 : prevIndex + 1));
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVideoProgress = (e) => {
    if (!videoRef.current) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * videoRef.current.duration;
    
    videoRef.current.currentTime = newTime;
    setVideoProgress(pos * 100);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-gray-800 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-900">
          <h3 className="text-xl font-semibold text-white truncate">{venue.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
            aria-label="Close modal"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 bg-gray-900">
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'images' ? 'text-white border-b-2 border-primary-500 bg-gray-800' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'}`}
            onClick={() => {
              setActiveTab('images');
              setCurrentIndex(0);
            }}
            aria-label="View images"
          >
            Images
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'videos' ? 'text-white border-b-2 border-primary-500 bg-gray-800' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'}`}
            onClick={() => {
              setActiveTab('videos');
              setCurrentIndex(0);
            }}
            aria-label="View videos"
          >
            Videos
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 bg-gray-900">
          {!hasMedia ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {activeTab === 'images' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                )}
              </svg>
              <p>No {activeTab} available</p>
            </div>
          ) : (
            <div className="relative">
              {/* Media display */}
              <div className="flex justify-center items-center bg-black rounded-lg overflow-hidden relative">
                {activeTab === 'images' ? (
                  <div className="relative w-full flex justify-center items-center">
                    <img
                      src={media[currentIndex]}
                      alt={`${venue.name} - ${currentIndex + 1}`}
                      className="max-h-[60vh] max-w-full object-contain transition-opacity duration-300"
                      loading="lazy"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                      {currentIndex + 1} / {media.length}
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full flex justify-center items-center bg-black">
                    <video
                      ref={videoRef}
                      src={media[currentIndex]}
                      className="max-h-[60vh] max-w-full"
                      onClick={togglePlayPause}
                      playsInline
                    />
                    
                    {/* Custom video controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      {/* Progress bar */}
                      <div 
                        className="h-1 bg-gray-600 rounded-full mb-2 cursor-pointer"
                        onClick={handleVideoProgress}
                      >
                        <div 
                          className="h-full bg-primary-500 rounded-full relative"
                          style={{ width: `${videoProgress}%` }}
                        >
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full shadow"></div>
                        </div>
                      </div>
                      
                      {/* Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button 
                            onClick={togglePlayPause}
                            className="text-white hover:text-primary-500 transition-colors"
                            aria-label={isPlaying ? "Pause" : "Play"}
                          >
                            {isPlaying ? <FaPause className="w-4 h-4" /> : <FaPlay className="w-4 h-4" />}
                          </button>
                          <div className="text-white text-xs">
                            {currentIndex + 1} / {media.length}
                          </div>
                        </div>
                        <button 
                          onClick={toggleFullscreen}
                          className="text-white hover:text-primary-500 transition-colors"
                          aria-label="Toggle fullscreen"
                        >
                          <FaExpand className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Play button overlay (visible when paused) */}
                    {!isPlaying && (
                      <button 
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300"
                        onClick={togglePlayPause}
                        aria-label="Play video"
                      >
                        <div className="w-16 h-16 rounded-full bg-primary-500 bg-opacity-80 flex items-center justify-center">
                          <FaPlay className="w-6 h-6 text-white ml-1" />
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation arrows */}
              {media.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="Previous item"
                  >
                    <FaChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="Next item"
                  >
                    <FaChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Thumbnails */}
              <div className="flex mt-4 space-x-2 overflow-x-auto pb-2 hide-scrollbar">
                {media.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`flex-shrink-0 transition-all duration-200 transform hover:scale-105 ${currentIndex === index ? 'ring-2 ring-primary-500 scale-105' : 'opacity-70 hover:opacity-100'}`}
                    aria-label={`View ${activeTab === 'images' ? 'image' : 'video'} ${index + 1}`}
                  >
                    {activeTab === 'images' ? (
                      <img
                        src={item}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-16 w-24 object-cover rounded-md"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-16 w-24 bg-gray-700 rounded-md flex items-center justify-center relative overflow-hidden">
                        <FaPlay className="w-4 h-4 text-white opacity-70" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueMediaModal;