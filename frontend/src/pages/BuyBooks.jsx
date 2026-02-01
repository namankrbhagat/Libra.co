import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Clock, Tag, User, ArrowRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookLoader from '../components/ui/book-loader';

const BuyBooks = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ["All", "Engineering", "Medical", "Science", "Arts", "Business", "Novel", "Children", "Commerce", "Fiction", "Non-Fiction", "Others"];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/book'); // Assuming GET /api/book returns all books
        if (res.ok) {
          const data = await res.json();
          setBooks(data);
          setFilteredBooks(data);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    let result = books;

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(book => book.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query)
      );
    }

    setFilteredBooks(result);
  }, [searchQuery, selectedCategory, books]);

  // Revised Book Card Component
  const BookCard = ({ book }) => {
    // Initial status based on whether the current user is the buyer
    const initialStatus = book.status === 'Booked' && book.buyer === user?._id ? 'booked' : (book.status === 'Booked' ? 'unavailable' : 'idle');
    const [bookingStatus, setBookingStatus] = useState(initialStatus);
    const [loadingAction, setLoadingAction] = useState(false);

    const handleBookClick = async () => {
      setLoadingAction(true);
      try {
        const res = await fetch(`/api/book/${book._id}/book`, { method: 'POST' });
        const data = await res.json();
        if (res.ok) {
          setBookingStatus('booked');
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Booking failed", error);
      } finally {
        setLoadingAction(false);
      }
    };

    const handleCancelClick = async () => {
      setLoadingAction(true);
      try {
        const res = await fetch(`/api/book/${book._id}/cancel`, { method: 'POST' });
        const data = await res.json();
        if (res.ok) {
          setBookingStatus('idle');
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Cancellation failed", error);
      } finally {
        setLoadingAction(false);
      }
    };

    return (
      <div className={`bg-[#111] border ${bookingStatus === 'booked' ? 'border-orange-500/30' : 'border-white/10'} rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col group h-full relative`}>

        {/* Overlay for unavailable items (booked by others) */}
        {bookingStatus === 'unavailable' && (
          <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-red-500/20 text-red-500 border border-red-500/30 px-4 py-2 rounded-full font-medium">Currently Unavailable</span>
          </div>
        )}

        {/* Top: Images Section (Side by Side) */}
        <div className="h-48 grid grid-cols-2 gap-0.5 bg-neutral-900 border-b border-white/10 relative">
          <div className="relative overflow-hidden group/img">
            <img
              src={book.frontImage}
              alt="Front"
              className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
            />
            <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 px-1.5 py-0.5 rounded text-white/70">Front</span>
          </div>
          <div className="relative overflow-hidden group/img">
            <img
              src={book.backImage}
              alt="Back"
              className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
            />
            <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 px-1.5 py-0.5 rounded text-white/70">Back</span>
          </div>

          {/* Price Tag Overlay */}
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
            ₹{book.price}
          </div>
        </div>

        {/* Middle: Details Section */}
        <div className="p-5 flex-1 flex flex-col space-y-3">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-instrument-serif text-white leading-tight">{book.title}</h3>
              <span className="text-[10px] border border-white/20 rounded px-1.5 py-0.5 text-white/50 whitespace-nowrap ml-2">{book.category}</span>
            </div>
            <p className="text-sm text-white/50 mt-1">by {book.author}</p>
          </div>

          <div className="text-xs text-white/70 bg-white/5 p-3 rounded-lg leading-relaxed line-clamp-3">
            {book.desc}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-white/10 mt-auto">
            <img src={book.seller?.avatar || "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"} alt="Seller" className="w-5 h-5 rounded-full" />
            <span className="text-xs text-white/50">Seller: <span className="text-white/80">{book.seller?.fullName || "User"}</span></span>
          </div>
        </div>

        {/* Bottom: Action Bar */}
        <div className="p-4 bg-white/5 border-t border-white/10 min-h-[70px] flex items-center justify-between relative">

          {/* Bottom Left: Booked Status (appears after clicking) */}
          <div className={`transition-all duration-500 transform ${bookingStatus === 'booked' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute'}`}>
            <div className="flex items-center gap-1.5 text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Booked</span>
            </div>
          </div>

          {/* Bottom Right: Actions */}
          <div className="ml-auto flex gap-2">
            {/* Check if user is seller */}
            {(book.seller?._id === user?._id || book.seller === user?._id) ? (
              <button
                disabled
                className="px-6 py-2 bg-white/10 text-white/40 text-sm font-medium rounded-full cursor-not-allowed border border-white/5"
              >
                Your Listing
              </button>
            ) : bookingStatus === 'idle' ? (
              <button
                onClick={handleBookClick}
                disabled={loadingAction}
                className="px-6 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-neutral-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-50"
              >
                {loadingAction ? '...' : 'Book'}
              </button>
            ) : (
              <div className="flex gap-2 animate-fade-in flex-wrap justify-end">
                <button
                  onClick={handleCancelClick}
                  disabled={loadingAction}
                  className="px-3 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-xs hover:bg-red-500/20 transition-colors"
                >
                  {loadingAction ? '...' : 'Cancel'}
                </button>
                <div className="relative group/loc">
                  <button className="px-3 py-1.5 border border-white/20 rounded-lg text-xs text-white hover:bg-white/10 transition-colors">
                    Location
                  </button>
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 right-0 w-48 bg-neutral-900 border border-white/10 p-3 rounded-xl text-xs text-white/80 opacity-0 invisible group-hover/loc:opacity-100 group-hover/loc:visible transition-all z-50 shadow-xl backdrop-blur-xl translate-y-2 group-hover/loc:translate-y-0 text-left pointer-events-none">
                    <p className="font-semibold text-white mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                      Seller Address
                    </p>
                    <p className="leading-relaxed text-white/60">
                      {book.seller?.address || "No address provided by seller."}
                    </p>
                  </div>
                </div>
                <button className="px-3 py-1.5 border border-white/20 rounded-lg text-xs text-white hover:bg-white/10 transition-colors">
                  Track
                </button>
                <button className="px-4 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
                  Buy
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    );
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

      {/* Search Header */}
      <div className="max-w-7xl mx-auto mb-12 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-instrument-serif bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
            Find Your Next Read
          </h1>
          <p className="text-white/40 max-w-2xl mx-auto">
            Browse through our collection of pre-loved books from students on your campus.
          </p>
        </div>

        {/* Search Bar & Filters */}
        <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by title, author, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all placeholder:text-white/20 text-white"
            />
          </div>

          <div className="relative min-w-[200px]">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 pointer-events-none">
              <Filter className="w-5 h-5" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-8 py-4 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all text-white appearance-none cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-neutral-900">{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <BookLoader />
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white/5 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-xl text-white font-medium mb-2">No books found</h3>
            <p className="text-white/40">Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default BuyBooks;
