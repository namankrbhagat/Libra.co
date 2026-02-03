import React, { useState } from 'react';
import { Upload, X, Loader2, DollarSign, BookOpen, Tag, FileText, Image as ImageIcon, MapPin } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const InputGroup = ({ label, icon: Icon, required, children }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-white/80 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-orange-500" />}
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const SellBook = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    price: '',
    desc: '',
    address: user?.address || '', // Pre-fill if available
    location: null, // { latitude, longitude }
    frontImage: null,
    backImage: null
  });

  const [previews, setPreviews] = useState({
    frontImage: null,
    backImage: null
  });

  const categories = ["Engineering", "Medical", "Science", "Arts", "Business", "Novel", "Children", "Commerce", "Fiction", "Non-Fiction", "Others"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setFormData(prev => ({ ...prev, [field]: file }));
      setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
    }
  };

  const removeImage = (field) => {
    setFormData(prev => ({ ...prev, [field]: null }));
    setPreviews(prev => ({ ...prev, [field]: null }));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    toast.loading("Fetching location...", { id: 'loc' });
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      let address = '';

      // Try to fetch address from OpenStreetMap (Free, no key)
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        address = data.display_name;
      } catch (err) {
        console.error("Geocoding failed", err);
      }

      setFormData(prev => ({
        ...prev,
        address: address || prev.address || `${latitude}, ${longitude}`,
        location: { latitude, longitude }
      }));
      toast.success("Location captured!", { id: 'loc' });
    }, (error) => {
      console.error(error);
      let errorMessage = "Unable to retrieve location";
      if (error.code === error.PERMISSION_DENIED) {
        errorMessage = "Location permission denied. Please enable it in your browser settings.";
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        errorMessage = "Location information is unavailable.";
      } else if (error.code === error.TIMEOUT) {
        errorMessage = "The request to get user location timed out.";
      }
      toast.error(errorMessage, { id: 'loc', duration: 5000 });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.frontImage || !formData.backImage) {
      toast.error("Please upload both front and back images");
      return;
    }

    if (!formData.location && !formData.address) {
      // Allow if address is manually entered, but prefer location for maps
      // If strict location required:
      // toast.error("Please click 'Get Location' to add your location");
      // return;
    }

    if (!formData.location) {
      // Should ideally have location for distance filtering
      // But if they entered address manually, maybe we skip location coords? 
      // For now, let's warn but proceed if address exists, or enforce location?
      // The original code enforced: if (!formData.location) return;
    }

    // Strict check as per original intent
    if (!formData.location) {
      toast.error("Please click 'Get Location' to add your location");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('author', formData.author);
    data.append('category', formData.category);
    data.append('price', formData.price);
    data.append('desc', formData.desc);
    data.append('address', formData.address || '');
    data.append('location', JSON.stringify(formData.location));
    data.append('frontImage', formData.frontImage);
    data.append('backImage', formData.backImage);

    try {
      const res = await fetch('/api/book/add', {
        method: 'POST',
        body: data,
        // Note: Do NOT set Content-Type header manually when using FormData
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("Book listed successfully!");
        navigate('/profile'); // Redirect to profile to see the listing
      } else {
        toast.error(result.message || "Failed to list book");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white py-24 px-4 sm:px-6 lg:px-8 selection:bg-orange-500/30 relative">

      {/* Profile Button */}
      <div className="fixed top-6 right-6 z-50">
        <Link to="/profile" className="inline-flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md p-1 hover:bg-white/10 transition-colors ring-1 ring-white/10 shadow-lg">
          <img
            src={user?.avatar || "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"}
            alt="Profile"
            className="h-10 w-10 rounded-full object-cover"
          />
        </Link>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-instrument-serif mb-3 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Sell Your Book
          </h1>
          <p className="text-white/40">Enter the details below to list your book for sale.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-neutral-900/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 space-y-8 shadow-xl">

          {/* Basic Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="Book Title" icon={BookOpen} required>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                placeholder="e.g. Introduction to Algorithms"
                required
              />
            </InputGroup>

            <InputGroup label="Author" icon={Tag} required>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                placeholder="e.g. Thomas H. Cormen"
                required
              />
            </InputGroup>

            <InputGroup label="Category" icon={Tag} required>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all text-white appearance-none cursor-pointer"
                required
              >
                <option value="" disabled className="bg-neutral-900 text-white/40">Select validation category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-neutral-900">{cat}</option>
                ))}
              </select>
            </InputGroup>

            <InputGroup label="Price (₹)" icon={DollarSign} required>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                placeholder="e.g. 450"
                min="0"
                required
              />
            </InputGroup>

          </div>

          <InputGroup label="Pickup Address" icon={MapPin} required>
            <div className="relative">
              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-28 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                placeholder="Enter full address for pickup"
                required
              />
              <button
                type="button"
                onClick={handleGetLocation}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-orange-500/10 text-orange-500 text-xs font-medium rounded-lg hover:bg-orange-500/20 transition-colors"
              >
                Get Location
              </button>
            </div>
          </InputGroup>

          <InputGroup label="Description" icon={FileText} required>
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all placeholder:text-white/20 min-h-[120px]"
              placeholder="Describe the condition of the book, edition, etc."
              required
            />
          </InputGroup>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white/90 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-orange-500" />
              Book Images <span className="text-red-500 text-sm">*</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Front Image */}
              <div className="space-y-2">
                <label className="text-sm text-white/60 block text-center">Front Cover</label>
                <div className={`relative h-64 rounded-2xl border-2 border-dashed transition-all ${previews.frontImage ? 'border-orange-500/50 bg-neutral-900' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}>
                  {previews.frontImage ? (
                    <>
                      <img src={previews.frontImage} alt="Front Preview" className="w-full h-full object-contain rounded-2xl" />
                      <button
                        type="button"
                        onClick={() => removeImage('frontImage')}
                        className="absolute top-2 right-2 p-1.5 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/40 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                      <Upload className="w-8 h-8 text-white/20 mb-3" />
                      <span className="text-sm text-white/40">Click to upload</span>
                      <span className="text-xs text-white/20 mt-1">PNG, JPG up to 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'frontImage')}
                        required
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Back Image */}
              <div className="space-y-2">
                <label className="text-sm text-white/60 block text-center">Back Cover</label>
                <div className={`relative h-64 rounded-2xl border-2 border-dashed transition-all ${previews.backImage ? 'border-orange-500/50 bg-neutral-900' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}>
                  {previews.backImage ? (
                    <>
                      <img src={previews.backImage} alt="Back Preview" className="w-full h-full object-contain rounded-2xl" />
                      <button
                        type="button"
                        onClick={() => removeImage('backImage')}
                        className="absolute top-2 right-2 p-1.5 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/40 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                      <Upload className="w-8 h-8 text-white/20 mb-3" />
                      <span className="text-sm text-white/40">Click to upload</span>
                      <span className="text-xs text-white/20 mt-1">PNG, JPG up to 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'backImage')}
                        required
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl font-medium text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Listing Book...
              </>
            ) : (
              "List Book For Sale"
            )}
          </button>

        </form>
      </div >
    </div >
  )
}

export default SellBook;
