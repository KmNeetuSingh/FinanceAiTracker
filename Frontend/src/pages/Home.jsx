import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* ✅ Text Section - shows first on mobile */}
          <div className="text-white order-1 lg:order-1">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 ring-1 ring-inset ring-blue-500/20">
              New • AI-powered insights
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mt-4 md:mt-6 leading-tight tracking-tight">
              Finance Tracker AI
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mt-4 md:mt-6">
              Upload statements, auto-categorize transactions, and understand your cash flow
              with beautiful dashboards and exportable reports.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-6 md:mt-8">
              <Link to="/register" className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow">
                Get Started Free
              </Link>
              <Link to="/login" className="px-6 py-3 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 ring-1 ring-white/20">
                I already have an account
              </Link>
            </div>
            {/* <div className="mt-6 text-xs text-slate-400">
              Video auto-plays muted per browser policy. Click to unmute if needed.
            </div> */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-white/5 ring-1 ring-white/10">
                <p className="text-sm font-medium text-white">Smart Categorization</p>
                <p className="text-xs text-slate-300">AI groups your transactions automatically.</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 ring-1 ring-white/10">
                <p className="text-sm font-medium text-white">Clear Reports</p>
                <p className="text-xs text-slate-300">See income, expenses, and trends instantly.</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 ring-1 ring-white/10">
                <p className="text-sm font-medium text-white">Private & Secure</p>
                <p className="text-xs text-slate-300">Your data stays with you.</p>
              </div>
            </div>
          </div>

          {/* ✅ Video Section - shows second on mobile */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl bg-black ring-1 ring-white/10 order-2 lg:order-2">
            <div className="w-full h-[60vh] md:h-[74vh] rounded-2xl overflow-hidden">
              <video className="w-full h-full object-cover" autoPlay muted playsInline loop>
                <source src="/Hero.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 p-6">
              <h2 className="text-white text-xl md:text-2xl font-semibold">See your money clearly</h2>
              <p className="text-white/80 text-sm md:text-base">
                Import statements, auto-categorize, track spending in seconds.
              </p>
            </div>
          </div>

        </div>
      </main>
      <footer className="bg-slate-800 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-300">
          <p>© {new Date().getFullYear()} Finance Tracker AI</p>
          <div className="mt-2 sm:mt-0">Built for clarity and control.</div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
