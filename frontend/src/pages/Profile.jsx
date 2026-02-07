import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Package, Clock, CheckCircle, XCircle, ShoppingBag, LogOut, ArrowLeft, ShieldCheck, Loader2, Camera } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';

const ProfilePage = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    sellingStats: { listed: 0, reserved: 0, collected: 0 },
    sellingHistory: [],
    buyingStats: { booked: 0, active: 0, collected: 0 },
    buyingHistory: []
  });

  // OTP Modal State
  const [otpModal, setOtpModal] = useState({ open: false, bookId: null, bookTitle: '', mode: 'verify', otpDisplay: null });
  const [otpInput, setOtpInput] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Image Preview State
  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/history`, { credentials: 'include' });
        if (res.ok) {
          const result = await res.json();
          setData(result);
        } else {
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
      const res = await fetch(`${API_BASE_URL}/api/auth/logout`, { method: "POST", credentials: 'include' });
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
      const res = await fetch(`${API_BASE_URL}/api/book/${bookId}/cancel`, { method: 'POST', credentials: 'include' });
      if (res.ok) {
        toast.success("Booking cancelled successfully");
        setData(prev => ({
          ...prev,
          buyingStats: { ...prev.buyingStats, booked: prev.buyingStats.booked - 1 },
          buyingHistory: prev.buyingHistory.filter(item => item._id !== bookId)
        }));

        const historyRes = await fetch(`${API_BASE_URL}/api/user/history`, { credentials: 'include' });
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

  const handleOpenVerify = (book) => {
    setOtpModal({ open: true, bookId: book._id, bookTitle: book.title, mode: 'verify', otpDisplay: null });
    setOtpInput('');
  };

  const handleOpenGenerate = (book) => {
    setOtpModal({ open: true, bookId: book._id, bookTitle: book.title, mode: 'generate', otpDisplay: null });
  };

  /* 
   * SELLER generates OTP -> Sends via SMS to Buyer -> Opens Verify Modal
   */
  /* 
   * STEP 1: Open Confirmation Modal
   */
  const handleOpenOTPConfirm = (book) => {
    setOtpModal({ open: true, bookId: book._id, bookTitle: book.title, mode: 'confirm', otpDisplay: null });
  };

  /* 
   * STEP 2: Actually Generate & Send OTP -> Switch to Verify Mode
   */
  const sendOTPAndSwitchToVerify = async () => {
    // Use the bookId from state, as this is called from within the modal
    const bookId = otpModal.bookId;
    setOtpLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/book/${bookId}/otp/send`, { method: 'POST', credentials: 'include' });
      const result = await res.json();

      if (res.ok) {
        toast.success("OTP sent to buyer's phone!");
        setOtpModal(prev => ({ ...prev, mode: 'verify' }));
      } else {
        toast.error(result.message || "Failed to send OTP");
        // Keep modal open but maybe stay in confirm mode or close? 
        // Let's stay in confirm so they can retry or cancel.
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Error sending OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otpInput) return toast.error("Please enter OTP");
    setVerifying(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/book/${otpModal.bookId}/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otpInput }),
        credentials: 'include'
      });
      const result = await res.json();

      if (res.ok) {
        toast.success("Sale completed! Book marked as Sold.");
        setOtpModal({ open: false, bookId: null, bookTitle: '', mode: 'verify', otpDisplay: null });

        setLoading(true);
        const historyRes = await fetch(`${API_BASE_URL}/api/user/history`, { credentials: 'include' });
        if (historyRes.ok) {
          setData(await historyRes.json());
        }
        setLoading(false);
      } else {
        toast.error(result.message || "Verification failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error verifying OTP");
    } finally {
      setVerifying(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        setPreviewImg(base64Image);

        // Upload to backend
        try {
          const res = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ avatar: base64Image }),
            credentials: 'include'
          });
          const result = await res.json();
          if (res.ok) {
            toast.success("Profile picture updated!");
            // Update global user state (and localStorage)
            if (setUser) {
              const updatedUser = { ...user, avatar: result.updatedUser.avatar };
              setUser(updatedUser);
              localStorage.setItem("user", JSON.stringify(updatedUser)); // Assuming 'user' is the key
            }
          } else {
            toast.error(result.message || "Failed to update profile picture");
          }
        } catch (error) {
          console.error("Error upload:", error);
          toast.error("Error updating profile picture");
        }
      };
      reader.readAsDataURL(file);
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
                src={previewImg || user?.avatar || "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"}
                alt={user?.fullName || "User"}
                className="relative w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-[#050505]"
              />
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-neutral-800 p-2 rounded-full border border-white/10 cursor-pointer hover:bg-neutral-700 transition-colors z-20">
                <Camera className="w-4 h-4 text-white/60 group-hover:text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
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
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span>{user?.phone || "No phone added"}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
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
                      <div className="flex items-center gap-2">
                        <StatusBadge status={item.status} />
                        {(item.status === 'Booked') && (
                          <button
                            onClick={() => handleOpenOTPConfirm(item)}
                            className="bg-orange-500/10 text-orange-500 px-3 py-1.5 rounded text-xs hover:bg-orange-500/20 transition-colors border border-orange-500/20 whitespace-nowrap"
                          >
                            Generate OTP
                          </button>
                        )}
                      </div>
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

      {/* OTP Modal */}
      {otpModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setOtpModal({ open: false, bookId: null, bookTitle: '', mode: 'verify', otpDisplay: null })}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              <XCircle className="w-5 h-5" />
            </button>

            {otpModal.mode === 'confirm' ? (
              /* MODE: CONFIRMATION */
              <>
                <h3 className="text-xl font-instrument-serif text-white mb-2">Initiate Sale</h3>
                <p className="text-white/60 text-sm mb-6">
                  Verify the buyer is present. Clicking below will generate an OTP and send it to the buyer's phone.
                  The book will be marked as <span className="text-orange-500">Sold</span> only after you enter the correct OTP provided by the buyer.
                </p>

                <button
                  onClick={sendOTPAndSwitchToVerify}
                  disabled={otpLoading}
                  className="w-full py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {otpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  Generate OTP & Verify
                </button>
              </>
            ) : (
              /* MODE: VERIFY INPUT */
              <>
                <h3 className="text-xl font-instrument-serif text-white mb-2">Complete Sale</h3>
                <p className="text-white/60 text-sm mb-6">
                  OTP sent to Buyer. Ask them for the code and enter it below to complete the sale of
                  <span className="text-orange-500 font-medium ml-1">{otpModal.bookTitle}</span>.
                </p>

                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-white/10"
                    />
                  </div>

                  <button
                    onClick={verifyOTP}
                    disabled={verifying || otpInput.length !== 6}
                    className="w-full py-3 bg-white text-black font-medium rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {verifying && <Loader2 className="w-4 h-4 animate-spin" />}
                    Verify & Complete
                  </button>

                  <p className="text-xs text-center text-white/30">
                    Didn't arrive? <button onClick={sendOTPAndSwitchToVerify} className="text-orange-500 hover:underline">Resend OTP</button>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;

