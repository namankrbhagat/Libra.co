import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Package, Clock, CheckCircle, XCircle, ShoppingBag, LogOut, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProfilePage = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    sellingStats: { listed: 0, reserved: 0, collected: 0 },
    sellingHistory: [],
    buyingStats: { booked: 0, active: 0, collected: 0 },
    buyingHistory: []
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/user/history');
        if (res.ok) {
          const result = await res.json();
          setData(result);
        } else {
          // Silently fail or log, as it might be empty
          console.error("Failed to fetch history");
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success("Logged out successfully");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error", error);
      toast.error("Logout failed");
    }
  };

  const handleCancelBooking = async (bookId) => {
    try {
      const res = await fetch(`/api/book/${bookId}/cancel`, { method: 'POST' });
      if (res.ok) {
        toast.success("Booking cancelled successfully");
        // Update local state to remove the cancelled book
        setData(prev => ({
          ...prev,
          buyingStats: { ...prev.buyingStats, booked: prev.buyingStats.booked - 1 },
          buyingHistory: prev.buyingHistory.filter(item => item._id !== bookId)
        }));
        // Note: If you want to keep it in history but mark as cancelled, you'd update instead of filter.
        // But usually cancelled bookings are removed from "Active/Booked" lists or moved to a cancelled list.
        // Given the stats logic, removing it from 'booked' list seems appropriate or we should refetch.
        // Let's refetch to be safe and get accurate updated state if structure is complex.
        // Actually, manual update is faster UI. Let's stick to manual update but maybe we need to know if it moves to another status?
        // For now, let's just remove it from the view or refresh.

        // Re-fetching is safer to ensure consistency with backend
        const historyRes = await fetch('/api/user/history');
        if (historyRes.ok) {
          const result = await historyRes.json();
          setData(result);
        }
      } else {
        toast.error("Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling:", error);
      toast.error("Something went wrong");
    }
  };

  const StatusBadge = ({ status }) => {
    let colors = "bg-neutral-800 text-neutral-400";
    const s = status || "Available";

    if (s === "Available" || s === "Active") colors = "bg-orange-500/10 text-orange-500 border border-orange-500/20";
    if (s === "Reserved" || s === "Booked") colors = "bg-blue-500/10 text-blue-500 border border-blue-500/20";
    if (s === "Collected" || s === "Sold") colors = "bg-green-500/10 text-green-500 border border-green-500/20";
    if (s === "Cancelled") colors = "bg-red-500/10 text-red-500 border border-red-500/20";

    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors}`}>
        {s}
      </span>
    );
  };

  const Card = ({ children, className }) => (
    <div className={`relative rounded-[1.25rem] border-[0.75px] border-white/10 bg-neutral-900/20 backdrop-blur-sm p-6 shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500/30">

      {/* Nav/Back */}
      <div className="absolute top-6 left-6 z-20">
        <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32">
        {/* Header with Logout */}
        <Card className="mb-8 p-8 bg-gradient-to-r from-neutral-900/50 to-neutral-900/30">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Image */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-orange-500 to-blue-500 rounded-full opacity-70 blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <img
                src={user?.avatar || "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"}
                alt={user?.fullName || "User"}
                className="relative w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-[#050505]"
              />
            </div>

            {/* User Details */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-instrument-serif text-white">{user?.fullName || "Guest User"}</h1>
                <p className="text-white/40 text-sm mt-1">Member since 2024</p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-white/60">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                  <Mail className="w-4 h-4 text-orange-500" />
                  <span>{user?.email || "email@example.com"}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="px-5 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors text-sm text-white/80">
                Edit Profile
              </button>
              <button onClick={handleLogout} className="px-5 py-2 rounded-full border border-red-500/20 hover:bg-red-500/10 text-red-400 transition-colors text-sm flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </Card>

        {/* Bottom Section: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Selling History */}
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-instrument-serif text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-500" />
                Selling History
              </h2>
            </div>

            {/* Stats Chips */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                <div className="text-lg font-semibold text-white">{data.sellingStats.listed}</div>
                <div className="text-xs text-white/40">Listed</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                <div className="text-lg font-semibold text-white">{data.sellingStats.reserved}</div>
                <div className="text-xs text-white/40">Booked</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                <div className="text-lg font-semibold text-white">{data.sellingStats.collected}</div>
                <div className="text-xs text-white/40">Collected</div>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? <p className="text-white/40 text-sm text-center">Loading...</p> :
                data.sellingHistory.length === 0 ? <p className="text-white/40 text-sm text-center">No items listed yet.</p> :
                  data.sellingHistory.map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
                      <div>
                        <h3 className="text-white font-medium text-sm group-hover:text-orange-400 transition-colors">{item.title}</h3>
                        <div className="flex gap-2 text-xs text-white/40 mt-1">
                          <span>{item.price}</span>
                          <span>•</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                  ))
              }
            </div>
          </Card>


          {/* Buying History */}
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-instrument-serif text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-500" />
                Buying History
              </h2>
            </div>

            {/* Stats Chips */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                <div className="text-lg font-semibold text-white">{data.buyingStats.booked}</div>
                <div className="text-xs text-white/40">Booked</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                <div className="text-lg font-semibold text-white">{data.buyingStats.active}</div>
                <div className="text-xs text-white/40">Active</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                <div className="text-lg font-semibold text-white">{data.buyingStats.collected}</div>
                <div className="text-xs text-white/40">Collected</div>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? <p className="text-white/40 text-sm text-center">Loading...</p> :
                data.buyingHistory.length === 0 ? <p className="text-white/40 text-sm text-center">No bookings yet.</p> :
                  data.buyingHistory.map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
                      <div>
                        <h3 className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors">{item.title}</h3>
                        <div className="flex gap-2 text-xs text-white/40 mt-1">
                          <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {item.seller}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={item.status} />
                        {item.status === 'Booked' && (
                          <button
                            onClick={() => handleCancelBooking(item._id)}
                            className="text-xs text-red-500 hover:bg-red-500/10 px-2 py-1 rounded transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))
              }
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
