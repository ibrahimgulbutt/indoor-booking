import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaImage, FaPercent, FaSave, FaTimes } from 'react-icons/fa';
import MediaManagement from './MediaManagement';

const AdminControlPanel = () => {
  // State for venues/courts management
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courts');
  
  // State for editing
  const [editingVenue, setEditingVenue] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // State for image upload
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  
  // State for discounts
  const [discounts, setDiscounts] = useState([]);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [showAddDiscountForm, setShowAddDiscountForm] = useState(false);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVenues([
        { 
          id: 1, 
          name: 'Basketball Court 1', 
          type: 'Basketball', 
          pricePerHour: 500,
          images: [
            '/images/basketball-court-1.jpg',
            '/images/basketball-court-2.jpg'
          ],
          videos: [
            '/videos/basketball-court-preview.mp4'
          ]
        },
        { 
          id: 2, 
          name: 'Tennis Court 1', 
          type: 'Tennis', 
          pricePerHour: 600,
          images: [
            '/images/tennis-court-1.jpg',
            '/images/tennis-court-2.jpg'
          ],
          videos: [
            '/videos/tennis-court-preview.mp4'
          ]
        },
        { 
          id: 3, 
          name: 'Badminton Court 1', 
          type: 'Badminton', 
          pricePerHour: 400,
          images: [
            '/images/badminton-court-1.jpg',
            '/images/badminton-court-2.jpg'
          ],
          videos: [
            '/videos/badminton-court-preview.mp4'
          ]
        },
      ]);
      
      setDiscounts([
        { id: 1, code: 'SUMMER2024', percentage: 10, validUntil: '2024-08-31', isActive: true },
        { id: 2, code: 'WEEKEND', percentage: 5, validUntil: '2024-12-31', isActive: true },
        { id: 3, code: 'FIRSTTIME', percentage: 15, validUntil: '2024-06-30', isActive: false },
      ]);
      
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handle venue form change
  const handleVenueFormChange = (e) => {
    const { name, value } = e.target;
    setEditingVenue(prev => ({
      ...prev,
      [name]: name === 'pricePerHour' ? Number(value) : value
    }));
  };

  // Handle discount form change
  const handleDiscountFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingDiscount(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'percentage' ? Number(value) : value
    }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Handle media updates from MediaManagement component
  const handleMediaUpdate = (venueId, mediaUpdates) => {
    setVenues(venues.map(venue => {
      if (venue.id === venueId) {
        return {
          ...venue,
          ...mediaUpdates
        };
      }
      return venue;
    }));
    
    // In a real app, you would make an API call here
    // Example: await venueApi.updateVenueMedia(venueId, mediaUpdates);
  };

  // Save venue changes
  const saveVenueChanges = () => {
    if (!editingVenue) return;
    
    if (editingVenue.id) {
      // Update existing venue
      setVenues(venues.map(venue => 
        venue.id === editingVenue.id ? editingVenue : venue
      ));
      
      // In a real app, you would make an API call here
      // Example: await venueApi.updateVenue(editingVenue.id, editingVenue);
      
      // If there's a new image, upload it
      if (selectedImage) {
        // In a real app, you would upload the image to a server
        // Example: await venueApi.uploadVenueImage(editingVenue.id, selectedImage);
        
        // For now, just add the preview to the venue's images
        const updatedVenue = venues.find(v => v.id === editingVenue.id);
        if (updatedVenue) {
          updatedVenue.images = [...updatedVenue.images, previewImage];
        }
      }
    } else {
      // Add new venue
      const newVenue = {
        ...editingVenue,
        id: venues.length + 1,
        images: selectedImage ? [previewImage] : [],
        videos: []
      };
      
      setVenues([...venues, newVenue]);
      
      // In a real app, you would make an API call here
      // Example: await venueApi.createVenue(newVenue);
    }
    
    // Reset form
    setEditingVenue(null);
    setSelectedImage(null);
    setPreviewImage('');
    setShowAddForm(false);
  };

  // Save discount changes
  const saveDiscountChanges = () => {
    if (!editingDiscount) return;
    
    if (editingDiscount.id) {
      // Update existing discount
      setDiscounts(discounts.map(discount => 
        discount.id === editingDiscount.id ? editingDiscount : discount
      ));
      
      // In a real app, you would make an API call here
      // Example: await discountApi.updateDiscount(editingDiscount.id, editingDiscount);
    } else {
      // Add new discount
      const newDiscount = {
        ...editingDiscount,
        id: discounts.length + 1
      };
      
      setDiscounts([...discounts, newDiscount]);
      
      // In a real app, you would make an API call here
      // Example: await discountApi.createDiscount(newDiscount);
    }
    
    // Reset form
    setEditingDiscount(null);
    setShowAddDiscountForm(false);
  };

  // Delete venue
  const deleteVenue = (id) => {
    if (window.confirm('Are you sure you want to delete this court? This action cannot be undone.')) {
      setVenues(venues.filter(venue => venue.id !== id));
      
      // In a real app, you would make an API call here
      // Example: await venueApi.deleteVenue(id);
    }
  };

  // Delete discount
  const deleteDiscount = (id) => {
    if (window.confirm('Are you sure you want to delete this discount? This action cannot be undone.')) {
      setDiscounts(discounts.filter(discount => discount.id !== id));
      
      // In a real app, you would make an API call here
      // Example: await discountApi.deleteDiscount(id);
    }
  };

  // Toggle discount active status
  const toggleDiscountStatus = (id) => {
    setDiscounts(discounts.map(discount => 
      discount.id === id ? { ...discount, isActive: !discount.isActive } : discount
    ));
    
    // In a real app, you would make an API call here
    // Example: await discountApi.toggleDiscountStatus(id);
  };

  // Render courts/venues management tab
  const renderCourtsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Manage Courts</h3>
        <button 
          onClick={() => {
            setEditingVenue({ name: '', type: '', pricePerHour: 0 });
            setShowAddForm(true);
          }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FaPlus /> Add New Court
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-400">Loading courts...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Court Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price (PKR/hr)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Images</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {venues.map((venue) => (
                <tr key={venue.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{venue.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{venue.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{venue.pricePerHour}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex items-center">
                      <span className="mr-2">{venue.images.length} photos</span>
                      <span className="text-gray-500">|</span>
                      <span className="ml-2">{venue.videos.length} videos</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => {
                          setEditingVenue(venue);
                          setShowAddForm(true);
                        }}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => deleteVenue(venue.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <FaTrash />
                      </button>
                      <MediaManagement 
                        venue={venue} 
                        onMediaUpdate={handleMediaUpdate} 
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Court Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">
                {editingVenue.id ? 'Edit Court' : 'Add New Court'}
              </h3>
              <button 
                onClick={() => {
                  setShowAddForm(false);
                  setEditingVenue(null);
                  setSelectedImage(null);
                  setPreviewImage('');
                }}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Court Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingVenue.name}
                  onChange={handleVenueFormChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                <select
                  name="type"
                  value={editingVenue.type}
                  onChange={handleVenueFormChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Volleyball">Volleyball</option>
                  <option value="Football">Football</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Price per Hour (PKR)</label>
                <input
                  type="number"
                  name="pricePerHour"
                  value={editingVenue.pricePerHour}
                  onChange={handleVenueFormChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Upload Image</label>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start mb-2 sm:mb-0">
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
                </div>
                <p className="text-xs text-gray-400 mt-1">Supported formats: JPG, PNG, WebP. Max size: 5MB</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end mt-6 sm:space-x-3 space-y-2 sm:space-y-0">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingVenue(null);
                    setSelectedImage(null);
                    setPreviewImage('');
                  }}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveVenueChanges}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto"
                >
                  <FaSave /> {editingVenue.id ? 'Update Court' : 'Add Court'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render discounts management tab
  const renderDiscountsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Manage Discounts</h3>
        <button 
          onClick={() => {
            setEditingDiscount({ code: '', percentage: 5, validUntil: '', isActive: true });
            setShowAddDiscountForm(true);
          }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FaPlus /> Add New Discount
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-400">Loading discounts...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Code</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Discount %</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Valid Until</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {discounts.map((discount) => (
                <tr key={discount.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{discount.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{discount.percentage}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{discount.validUntil}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs ${discount.isActive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}
                    >
                      {discount.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => toggleDiscountStatus(discount.id)}
                        className={`${discount.isActive ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}
                      >
                        {discount.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => {
                          setEditingDiscount(discount);
                          setShowAddDiscountForm(true);
                        }}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => deleteDiscount(discount.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Discount Form Modal */}
      {showAddDiscountForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">
                {editingDiscount.id ? 'Edit Discount' : 'Add New Discount'}
              </h3>
              <button 
                onClick={() => {
                  setShowAddDiscountForm(false);
                  setEditingDiscount(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Discount Code</label>
                <input
                  type="text"
                  name="code"
                  value={editingDiscount.code}
                  onChange={handleDiscountFormChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Discount Percentage</label>
                <input
                  type="number"
                  name="percentage"
                  value={editingDiscount.percentage}
                  onChange={handleDiscountFormChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="1"
                  max="100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Valid Until</label>
                <input
                  type="date"
                  name="validUntil"
                  value={editingDiscount.validUntil}
                  onChange={handleDiscountFormChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={editingDiscount.isActive}
                  onChange={handleDiscountFormChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-300">
                  Active
                </label>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddDiscountForm(false);
                    setEditingDiscount(null);
                  }}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveDiscountChanges}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <FaSave /> {editingDiscount.id ? 'Update Discount' : 'Add Discount'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-900 shadow-md rounded-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-800 overflow-x-auto">
        <button
          className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap flex-1 sm:flex-none text-center sm:text-left ${activeTab === 'courts' ? 'text-white border-b-2 border-primary-500' : 'text-gray-400 hover:text-gray-300'}`}
          onClick={() => setActiveTab('courts')}
        >
          <span className="block sm:hidden">Courts</span>
          <span className="hidden sm:block">Courts Management</span>
        </button>
        <button
          className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap flex-1 sm:flex-none text-center sm:text-left ${activeTab === 'discounts' ? 'text-white border-b-2 border-primary-500' : 'text-gray-400 hover:text-gray-300'}`}
          onClick={() => setActiveTab('discounts')}
        >
          <span className="block sm:hidden">Discounts</span>
          <span className="hidden sm:block">Discounts & Promotions</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-3 sm:p-6">
        {activeTab === 'courts' ? renderCourtsTab() : renderDiscountsTab()}
      </div>
    </div>
  );
};

export default AdminControlPanel;