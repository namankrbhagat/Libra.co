import React, { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, Routes, Navigate } from 'react-router-dom';
import BookLoader from "@/components/ui/book-loader";

import { SignIn1 } from "@/components/ui/loginPage";
import { SignUp } from "@/components/ui/signUpPage";

const Home = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(import('@/pages/Home'));
    }, 1000);
  });
});

const Profile = lazy(() => import('@/pages/Profile'));
const SellBook = lazy(() => import('@/pages/SellBook'));
const BuyBooks = lazy(() => import('@/pages/BuyBooks'));

const LoginPage = ({ setUser }) => (
  <div className="relative">
    <div className="absolute inset-0 z-0 filter blur-sm pointer-events-none">
      <Suspense fallback={<div className="bg-[#050505] h-screen w-full" />}>
        <Home />
      </Suspense>
    </div>
    <div className="relative z-10 min-h-screen bg-black/60 flex items-center justify-center">
      <SignIn1 setUser={setUser} />
    </div>
  </div>
);

const SignupPage = ({ setUser }) => (
  <div className="relative">
    <div className="absolute inset-0 z-0 filter blur-sm pointer-events-none">
      <Suspense fallback={<div className="bg-[#050505] h-screen w-full" />}>
        <Home />
      </Suspense>
    </div>
    <div className="relative z-10 min-h-screen bg-black/60 flex items-center justify-center">
      <SignUp setUser={setUser} />
    </div>
  </div>
);

const App = () => {
  const [user, setUser] = React.useState(null);
  const [isAuthChecking, setIsAuthChecking] = React.useState(true);

  React.useEffect(() => {
    // Check if user info is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsAuthChecking(false);
  }, []);

  if (isAuthChecking) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#050505]">
        <BookLoader />
      </div>
    );
  }

  return (
    <main className="bg-[#050505] min-h-screen text-white">
      <Toaster />
      <Suspense
        fallback={
          <div className="h-screen w-full flex items-center justify-center bg-[#050505]">
            <BookLoader />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/signup" element={<SignupPage setUser={setUser} />} />
          <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} />
          <Route path="/sell" element={user ? <SellBook user={user} /> : <Navigate to="/login" />} />
          <Route path="/buy" element={user ? <BuyBooks user={user} /> : <Navigate to="/login" />} />
        </Routes>
      </Suspense>
    </main>
  );
};

export default App;