import React, { useState } from 'react';
import { differenceInMinutes, parseISO, addDays, startOfDay, format } from 'date-fns';

const LogGrid = ({ logData }) => {
    const [hoveredLog, setHoveredLog] = useState(null);
    if (!logData || logData.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl dark:shadow-2xl p-8 border border-slate-200 dark:border-slate-800 flex items-center justify-center h-64">
                <p className="text-slate-500 dark:text-slate-400 font-medium">Generate a trip to see HOS compliance logs.</p>
            </div>
        );
    }

    // Process logs into continuous 24-hour segments
    const firstLogStart = parseISO(logData[0].start);
    const dayStart = startOfDay(firstLogStart);
    
    // Determine how many days the trip spans
    const lastLogEnd = parseISO(logData[logData.length - 1].end);
    const totalDays = Math.ceil((lastLogEnd - dayStart) / (1000 * 60 * 60 * 24)) || 1;
    
    const days = Array.from({ length: totalDays }, (_, i) => addDays(dayStart, i));

    const statusToRow = {
        "Off Duty": 0,
        "Sleeper Berth": 1,
        "Driving": 2,
        "On Duty": 3
    };

    const renderGridLines = () => {
        const lines = [];
        // Vertical hour lines
        for (let i = 0; i <= 24; i++) {
            const isQuarter = i !== 0 && i !== 24;
            lines.push(
                <line key={`v${i}`} x1={i * 100} y1={0} x2={i * 100} y2={400} stroke={i % 6 === 0 ? "#cbd5e1" : "#f1f5f9"} strokeWidth={i % 6 === 0 ? "2" : "1"} />
            );
            if (i < 24) {
                // Quarter hour ticks
                lines.push(<line key={`vq1${i}`} x1={i * 100 + 25} y1={0} x2={i * 100 + 25} y2={400} stroke="#f8fafc" strokeWidth="1" />);
                lines.push(<line key={`vq2${i}`} x1={i * 100 + 50} y1={0} x2={i * 100 + 50} y2={400} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />);
                lines.push(<line key={`vq3${i}`} x1={i * 100 + 75} y1={0} x2={i * 100 + 75} y2={400} stroke="#f8fafc" strokeWidth="1" />);
            }
        }
        // Horizontal status lines
        for (let i = 0; i < 4; i++) {
            lines.push(
                <line key={`h${i}`} x1={0} y1={i * 100 + 50} x2={2400} y2={i * 100 + 50} stroke="#e2e8f0" strokeWidth="1" />
            );
        }
        return lines;
    };

    return (
        <div className="space-y-8">
            {days.map((day, dayIndex) => {
                const currentDayStart = day;
                const nextDayStart = addDays(currentDayStart, 1);
                
                // Find logs that intersect this day
                const dayLogs = logData.filter(log => {
                    const start = parseISO(log.start);
                    const end = parseISO(log.end);
                    return start < nextDayStart && end > currentDayStart;
                });

                if (dayLogs.length === 0) return null;

                const points = [];
                let currentStatus = dayLogs[0].status;
                let lastX = 0;

                dayLogs.forEach(log => {
                    const logStart = parseISO(log.start);
                    const logEnd = parseISO(log.end);
                    
                    // Clamp to current day
                    const effectiveStart = logStart < currentDayStart ? currentDayStart : logStart;
                    const effectiveEnd = logEnd > nextDayStart ? nextDayStart : logEnd;
                    
                    const startMin = differenceInMinutes(effectiveStart, currentDayStart);
                    const endMin = differenceInMinutes(effectiveEnd, currentDayStart);
                    
                    const startX = (startMin / 60) * 100;
                    const endX = (endMin / 60) * 100;
                    
                    const y = statusToRow[log.status] * 100 + 50;

                    // Vertical line connecting state change
                    if (points.length > 0 && log.status !== currentStatus) {
                        const prevY = statusToRow[currentStatus] * 100 + 50;
                        points.push(`${startX},${prevY}`);
                    }
                    
                    points.push(`${startX},${y}`);
                    points.push(`${endX},${y}`);
                    
                    currentStatus = log.status;
                    lastX = endX;
                });
                
                // Connect path string
                const pathData = `M ${points.join(' L ')}`;

                return (
                    <div key={dayIndex} className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl dark:shadow-2xl p-6 border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="flex justify-between items-end mb-4">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Daily Log</h3>
                            <div className="text-brand-600 dark:text-brand-400 font-semibold">{format(day, 'MMM dd, yyyy')}</div>
                        </div>
                        
                        <div className="flex">
                            <div className="w-32 flex flex-col pt-[50px] space-y-[76px] text-sm font-medium text-slate-600 dark:text-slate-400">
                                <div>Off Duty</div>
                                <div>Sleeper Berth</div>
                                <div>Driving</div>
                                <div>On Duty</div>
                            </div>
                            
                            <div className="flex-1 overflow-x-auto relative ml-4 custom-scrollbar pb-4">
                                <div style={{ width: '2400px' }}>
                                    {/* Hour Headers */}
                                    <div className="flex absolute top-0 w-full h-8 border-b border-slate-200 dark:border-slate-700">
                                        {Array.from({ length: 24 }).map((_, i) => (
                                            <div key={i} className="flex-1 text-xs text-center text-slate-500 dark:text-slate-400 pt-1 border-r border-slate-200 dark:border-slate-700">
                                                {i === 0 ? 'M' : i === 12 ? 'N' : i}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <svg viewBox="0 0 2400 400" className="w-full h-40 mt-8 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700">
                                        {renderGridLines()}
                                        <path 
                                            d={pathData} 
                                            fill="none" 
                                            stroke="#14b8a6" 
                                            strokeWidth="4" 
                                            strokeLinejoin="round" 
                                            strokeLinecap="round" 
                                        />
                                        
                                        {/* Plot tooltips for events */}
                                        {dayLogs.map((log, i) => {
                                            const start = parseISO(log.start);
                                            const end = parseISO(log.end);
                                            const startMin = differenceInMinutes(start < currentDayStart ? currentDayStart : start, currentDayStart);
                                            const startX = (startMin / 60) * 100;
                                            const y = statusToRow[log.status] * 100 + 50;
                                            return (
                                                <circle 
                                                    key={i} 
                                                    cx={startX} 
                                                    cy={y} 
                                                    r="6" 
                                                    fill="#0d9488" 
                                                    className="cursor-pointer transition-all hover:fill-brand-400 hover:stroke-white hover:stroke-2"
                                                    onMouseEnter={(e) => {
                                                        setHoveredLog({
                                                            log: log,
                                                            x: e.clientX,
                                                            y: e.clientY
                                                        });
                                                    }}
                                                    onMouseLeave={() => setHoveredLog(null)}
                                                />
                                            )
                                        })}
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* NEW: The Floating Glassmorphism Tooltip */}
            {hoveredLog && (
                <div 
                    className="fixed z-[1000] pointer-events-none transform -translate-x-1/2 -translate-y-[120%]"
                    style={{ left: hoveredLog.x, top: hoveredLog.y }}
                >
                    <div className="bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-md text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700/50 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-brand-400"></span>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                {hoveredLog.log.status}
                            </span>
                        </div>
                        <p className="font-semibold text-sm mb-1">{hoveredLog.log.description}</p>
                        <div className="text-xs text-slate-400 border-t border-slate-700/50 pt-2 mt-1 flex justify-between">
                            <span>{format(parseISO(hoveredLog.log.start), 'h:mm a')} - {format(parseISO(hoveredLog.log.end), 'h:mm a')}</span>
                            <span className="font-medium text-brand-300">{hoveredLog.log.duration_hours.toFixed(1)} hrs</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LogGrid;
