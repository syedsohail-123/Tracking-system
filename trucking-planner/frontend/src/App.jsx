import React, { useState } from 'react';
import TripForm from './components/TripForm';
import MapView from './components/MapView';
import LogGrid from './components/LogGrid';
import { generateTrip } from './services/api';
import TripSummary from './components/TripSummary';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [tripData, setTripData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateTrip = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateTrip(formData);
      setTripData(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate trip. Please make sure the backend is running and valid locations were entered.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-300">
      <header className=" bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-brand-500 p-2 rounded-lg">
              <div className="bg-gradient-to-br from-brand-400 to-brand-600 p-2 rounded-xl shadow-lg shadow-brand-500/30"></div>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white"><span className="font-light text-brand-500 dark:text-brand-400">Compliance Planner</span></h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-grow p-6 md:p-8 relative">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-8 h-full relative z-10">
          {/* Sidebar */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <TripForm onSubmit={handleGenerateTrip} isLoading={isLoading} />

            {error && (
              <div className="mt-4 p-4 bg-red-900/30 border-l-4 border-red-500 rounded-r-xl text-red-700 shadow-sm blackdrop-blur-sm">
                <p className="font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex-grow flex flex-col min-h-[600px]">
            {/* Trip Summary */}
            <TripSummary tripData={tripData} />
            {/* Map Area */}
            <div className="h-[400px] lg:h-[450px] flex-shrink-0 mb-8 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
              <MapView mapData={tripData?.map_data} />
            </div>

            {/* HOS Logs Area */}
            <div className="flex-grow pb-10">
              <LogGrid logData={tripData?.log_data} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
