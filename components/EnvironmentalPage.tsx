import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { environmentalData } from '../data/environmentalData';
import { Wind, TrendingUp, AlertTriangle, MousePointer, Check, Thermometer, Lightbulb } from 'lucide-react';
import type { TimeSeriesDataPoint } from '../types';

const airbaseNames = Object.keys(environmentalData);

const COLORS = {
  no2: {
    'Hazrat Shahjalal Int. Airport (HSIA)': '#38bdf8', // sky-400
    'Tejgaon Air Base': '#34d399', // emerald-400
    'Mirpur Cantonment': '#fbbf24', // amber-400
  },
  ntl: {
    'Hazrat Shahjalal Int. Airport (HSIA)': '#0ea5e9', // sky-500
    'Tejgaon Air Base': '#10b981', // emerald-500
    'Mirpur Cantonment': '#f59e0b', // amber-500
  },
};

// --- Formatting Helpers ---
const toSuperScript = (numStr: string): string => {
    const superScriptMap: { [key: string]: string } = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
        '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻'
    };
    return numStr.split('').map(char => superScriptMap[char] || char).join('');
};

const formatScientificString = (num: number): string => {
  if (typeof num !== 'number' || isNaN(num) || num === null) {
    return 'N/A';
  }
  const [mantissa, exponent] = num.toExponential(2).split('e');
  return `${mantissa} × 10${toSuperScript(exponent)}`;
};

const formatScientificJSX = (num: number) => {
  if (typeof num !== 'number' || isNaN(num) || num === null) {
    return 'N/A';
  }
  const [mantissa, exponent] = num.toExponential(2).split('e');
  return (
    <>
      {mantissa} × 10<sup>{exponent}</sup>
    </>
  );
};


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-gray-300 p-3 rounded-lg text-sm">
        <p className="font-bold text-gray-900 mb-2">{label}</p>
        {payload.map((pld: any) => (
          <div key={pld.dataKey} style={{ color: pld.color }}>
            {pld.name}: {pld.dataKey.includes('no2') ? formatScientificJSX(pld.value) : pld.value.toFixed(2)}
          </div>
        ))}
      </div>
    );
  }
  return null;
};


const EnvironmentalPage: React.FC = () => {
    const [selectedAirbases, setSelectedAirbases] = useState<string[]>(airbaseNames);
    const [visibleSeries, setVisibleSeries] = useState({ no2: true, ntl: true });

    const handleAirbaseSelection = (airbaseName: string) => {
        setSelectedAirbases(prev => 
            prev.includes(airbaseName) 
            ? prev.filter(name => name !== airbaseName)
            : [...prev, airbaseName]
        );
    };

    const handleSeriesToggle = (seriesName: 'no2' | 'ntl') => {
        setVisibleSeries(prev => ({ ...prev, [seriesName]: !prev[seriesName] }));
    };

    const { chartData, summaryStats, alerts } = useMemo(() => {
        const dateMap: { [date: string]: { date: string; [key: string]: any } } = {};
        
        const allNo2Values: number[] = [];

        airbaseNames.forEach(name => {
            environmentalData[name].forEach(d => {
                if (!dateMap[d.date]) {
                    dateMap[d.date] = { date: d.date };
                }
                dateMap[d.date][`${name}_no2`] = d.no2;
                dateMap[d.date][`${name}_ntl`] = d.ntl;
                allNo2Values.push(d.no2);
            });
        });

        const sortedChartData = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
        
        const stats: { [key: string]: { latest: TimeSeriesDataPoint | null, peak: TimeSeriesDataPoint | null } } = {};
        
        airbaseNames.forEach(name => {
          const series = environmentalData[name];
          if (series.length > 0) {
            stats[name] = {
              latest: series[series.length - 1],
              peak: series.reduce((max, p) => p.no2 > max.no2 ? p : max, series[0]),
            };
          }
        });

        const sortedNo2 = [...allNo2Values].sort((a, b) => b - a);
        const alertThreshold = sortedNo2[Math.floor(sortedNo2.length * 0.2)];

        const highNo2Alerts: {name: string, point: TimeSeriesDataPoint}[] = [];
        airbaseNames.forEach(name => {
            environmentalData[name].forEach(d => {
                if(d.no2 >= alertThreshold) {
                    highNo2Alerts.push({ name, point: d });
                }
            });
        });
        
        return { chartData: sortedChartData, summaryStats: stats, alerts: highNo2Alerts.sort((a,b) => b.point.no2 - a.point.no2) };
    }, []);

    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50 text-gray-800">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center space-x-3 mb-6">
                    <Wind size={32} className="text-emerald-500"/>
                    <h1 className="text-3xl font-bold text-gray-900">Environmental Dashboard</h1>
                </div>

                {/* Dashboard Tip */}
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg mb-8 flex items-start space-x-3">
                    <Lightbulb size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-emerald-800">
                        <strong className="font-semibold">Dashboard Tip:</strong> Use the controls to compare air quality (NO₂) and nighttime light (NTL) trends. Toggle airbases or data series to focus your analysis on the chart below.
                    </p>
                </div>
                
                {/* Control Panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Airbase Selection */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                            <MousePointer size={20} className="mr-2 text-emerald-500" />
                            Select Airbases to Display
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {airbaseNames.map(name => (
                                <button
                                    key={name}
                                    onClick={() => handleAirbaseSelection(name)}
                                    className={`flex items-center justify-center space-x-2 font-semibold py-2 px-3 rounded-md transition-colors border text-sm ${
                                        selectedAirbases.includes(name) 
                                            ? 'bg-emerald-600 text-white border-emerald-500' 
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                                    }`}
                                >
                                    {selectedAirbases.includes(name) && <Check size={16} />}
                                    <span>{name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Data Series Selection */}
                     <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                            <TrendingUp size={20} className="mr-2 text-emerald-500" />
                            Select Data Series
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => handleSeriesToggle('no2')}
                                className={`flex items-center justify-center space-x-2 font-semibold py-2 px-3 rounded-md transition-colors border text-sm ${
                                    visibleSeries.no2
                                        ? 'bg-teal-600 text-white border-teal-500' 
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                                }`}
                            >
                                {visibleSeries.no2 && <Check size={16} />}
                                <span>NO₂ (Air Quality)</span>
                            </button>
                             <button
                                onClick={() => handleSeriesToggle('ntl')}
                                className={`flex items-center justify-center space-x-2 font-semibold py-2 px-3 rounded-md transition-colors border text-sm ${
                                    visibleSeries.ntl
                                        ? 'bg-amber-600 text-white border-amber-500' 
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                                }`}
                            >
                                {visibleSeries.ntl && <Check size={16} />}
                                <span>NTL (Nighttime Lights)</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xl h-[500px]">
                    <h2 className="text-xl font-semibold text-center mb-4">NO₂ & Nighttime Lights (NTL) Trends (2019-2024)</h2>
                    <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} />
                            
                            {visibleSeries.no2 && (
                                <YAxis yAxisId="left" stroke="#81e6d9" label={{ value: 'NO₂ (mol/m²)', angle: -90, position: 'insideLeft', fill: '#81e6d9', style:{textAnchor: 'middle'} }} tick={{ fontSize: 12 }} tickFormatter={formatScientificString} />
                            )}
                            {visibleSeries.ntl && (
                                <YAxis yAxisId="right" orientation="right" stroke="#f6e05e" label={{ value: 'VIIRS NTL', angle: 90, position: 'insideRight', fill: '#f6e05e', style:{textAnchor: 'middle'} }} tick={{ fontSize: 12 }}/>
                            )}

                            <Tooltip content={<CustomTooltip />} />
                            <Legend />

                            {visibleSeries.no2 && selectedAirbases.map(name => (
                                <Line key={`${name}_no2`} yAxisId="left" type="monotone" dataKey={`${name}_no2`} name={`${name.split(' ')[0]} NO₂`} stroke={COLORS.no2[name]} strokeWidth={2} dot={false} />
                            ))}
                            {visibleSeries.ntl && selectedAirbases.map(name => (
                                <Line key={`${name}_ntl`} yAxisId="right" type="monotone" dataKey={`${name}_ntl`} name={`${name.split(' ')[0]} NTL`} stroke={COLORS.ntl[name]} strokeWidth={2} dot={false} strokeDasharray="5 5"/>
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Summary & Alerts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-2xl font-semibold flex items-center mb-4">
                            <Lightbulb size={24} className="mr-3 text-yellow-400" />
                            Summary Statistics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {airbaseNames.map(name => (
                                <div key={name} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h4 className="font-bold text-lg text-emerald-600 mb-3">{name}</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 flex items-center"><Thermometer size={14} className="mr-1.5" /> Latest NO₂:</span>
                                            <span className="font-mono text-teal-500">{summaryStats[name]?.latest ? formatScientificJSX(summaryStats[name].latest.no2) : 'N/A'}</span>
                                        </div>
                                         <div className="flex justify-between items-center">
                                            <span className="text-gray-500 flex items-center"><TrendingUp size={14} className="mr-1.5" /> Peak NO₂:</span>
                                            <span className="font-mono text-red-500">
                                                {summaryStats[name]?.peak ? formatScientificJSX(summaryStats[name].peak.no2) : 'N/A'}
                                                <span className="text-gray-400 ml-1">({summaryStats[name]?.peak?.date})</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                           ))}
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-2xl font-semibold flex items-center mb-4 text-red-500">
                            <AlertTriangle size={24} className="mr-3" />
                            High NO₂ Alerts
                        </h3>
                        <p className="text-xs text-gray-500 mb-3">Months in the top 20th percentile for air pollution.</p>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                           {alerts.map(({name, point}, index) => (
                                <div key={index} className="flex justify-between items-center bg-red-100/50 p-2 rounded-md text-sm">
                                    <div>
                                        <span className="font-semibold text-gray-800">{name}</span>
                                        <span className="text-gray-500 ml-2">({point.date})</span>
                                    </div>
                                    <span className="font-mono text-red-600">{formatScientificJSX(point.no2)}</span>
                                </div>
                           ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnvironmentalPage;