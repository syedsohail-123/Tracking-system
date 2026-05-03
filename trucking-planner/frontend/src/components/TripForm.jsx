import React, { useState } from 'react';

const TripForm = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        current_location: 'Los Angeles, CA',
        pickup_location: 'Las Vegas, NV',
        dropoff_location: 'Salt Lake City, UT',
        cycle_used: 10
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className=" bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl dark:shadow-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col h-full">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Plan a Trip</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Enter details to generate compliance logs.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex-grow flex flex-col gap-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Location</label>
                    <input
                        type="text" name="current_location" value={formData.current_location} onChange={handleChange} required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="e.g. Los Angeles, CA"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pickup Location</label>
                    <input
                        type="text" name="pickup_location" value={formData.pickup_location} onChange={handleChange} required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="e.g. Las Vegas, NV"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Drop-off Location</label>
                    <input
                        type="text" name="dropoff_location" value={formData.dropoff_location} onChange={handleChange} required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="e.g. Salt Lake City, UT"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate- 300 mb-1">Current Cycle Used (Hours)</label>
                    <input
                        type="number" step="0.1" name="cycle_used" value={formData.cycle_used} onChange={handleChange} required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none placeholder-slate-400 dark:placeholder-slate-500"
                    />
                </div>

                <div className="mt-auto pt-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-brand-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : 'Generate Route & Logs'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TripForm;
