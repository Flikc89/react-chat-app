import { lazy, Suspense, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router';
import ChatPage from './pages/ChatPage';
import { useSocketStore } from './store/useSocketStore';

const AppBackground = lazy(() => import('./components/AppBackground'));

function App() {
  const { connectSocket } = useSocketStore();

  useEffect(() => {
    connectSocket();
  }, []);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <Suspense
        fallback={
          <div
            className="absolute inset-0 bg-violet-600"
            style={{ zIndex: 0 }}
          />
        }
      >
        <AppBackground />
      </Suspense>

      <div className="relative z-10 md:w-full h-full">
        <Routes>
          <Route path="/:chatId" element={<ChatPage />} />
          <Route path="/" element={<ChatPage />} />
        </Routes>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
