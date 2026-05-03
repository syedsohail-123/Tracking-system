import React from 'react';

const TripSummary = ({ tripData }) => {
    // Note: your backend returns the logs inside tripData.log_data
    if (!tripData || !tripData.log_data) return null;

    const logs = tripData.log_data;

    // Calculate stats
    const totalHours = logs.reduce((acc, log) => acc + log.duration_hours, 0);
    const drivingHours = logs
        .filter(log => log.status === 'Driving')
        .reduce((acc, log) => acc + log.duration_hours, 0);
    const stops = logs.filter(log =>
        log.description.includes('Fuel') ||
        log.description.includes('Break') ||
        log.description.includes('Rest')
    ).length;

    // Actual distance from backend
    const totalMiles = tripData.total_distance || 0;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-fade-in-up">
            <StatCard title="Total Distance" value={`${totalMiles} mi`} icon="🛣️" />
            <StatCard title="Driving Time" value={`${drivingHours.toFixed(1)} hrs`} icon="⏱️" />
            <StatCard title="Total Duration" value={`${totalHours.toFixed(1)} hrs`} icon="📅" />
            <StatCard title="Required Stops" value={stops} icon="🛑" />
        </div>
    );
};

// Reusable micro-component for the cards
const StatCard = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/20">
        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl text-2xl shadow-inner border border-slate-100 dark:border-transparent">
            {icon}
        </div>
        <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">{title}</p>
            <p className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">{value}</p>
        </div>
    </div>
);

export default TripSummary;
