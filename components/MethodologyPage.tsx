import React from 'react';
import { Database, BrainCircuit, BarChart3, TestTube2, Layers } from 'lucide-react';

const MethodologyPage: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <TestTube2 size={32} className="text-emerald-500"/>
          <h1 className="text-3xl font-bold text-gray-900">Methodology</h1>
        </div>

        <div className="space-y-8">
          {/* Data Sources Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 flex items-center"><Database size={24} className="mr-3 text-emerald-500"/>Data Sources</h2>
            <p className="text-gray-600 mb-4">To evaluate the urban environment around the three key airbases, we integrated several satellite-derived and geospatial datasets.</p>
            <ul className="list-disc list-inside space-y-4 text-gray-700">
              <li>
                <strong className="text-gray-900">Environmental Satellite Data (2019-2024):</strong>
                <ul className="list-['-_'] list-inside ml-6 mt-2 space-y-2 text-gray-600">
                    <li>
                        <strong>Nitrogen Dioxide (NO₂):</strong> Sourced from the <strong className="text-gray-900">NASA Sentinel-5P dataset</strong>. Raw satellite measurements were processed to generate monthly mean NO₂ concentrations, which serve as a key indicator of traffic and industrial air pollution.
                    </li>
                    <li>
                        <strong>Nighttime Lights (NTL):</strong> Sourced from the <strong className="text-gray-900">NASA VIIRS dataset</strong>. This data was processed to calculate monthly mean light intensity, acting as a proxy for urban density and economic activity.
                    </li>
                </ul>
              </li>
              <li>
                <strong className="text-gray-900">Urban Temperature Data (2014-2024):</strong> A time-series dataset of annual maximum temperatures for multiple locations across Dhaka. This data is used to analyze local climate trends and temperature variations over time.
              </li>
              <li>
                <strong className="text-gray-900">Dynamic World Land Cover:</strong> This dataset from <strong className="text-gray-900">Google & WRI</strong>, accessed via the Resource Watch API, provides a near real-time, high-resolution view of land use classifications (e.g., water, trees, built-up areas). It is used to understand the physical makeup of the areas surrounding the airbases.
              </li>
              <li>
                <strong className="text-gray-900">Geographic Base & Overlay Maps:</strong>
                 <ul className="list-['-_'] list-inside ml-6 mt-2 space-y-2 text-gray-600">
                    <li>
                        <strong>Base Map:</strong> The application uses the <strong className="text-gray-900">Carto Positron</strong> tile set, which provides a clean, muted background to emphasize data layers.
                    </li>
                    <li>
                        <strong>Street Highlights Overlay:</strong> The <strong className="text-gray-900">Carto Voyager</strong> tile set is used as an optional overlay to provide detailed street networks, place names, and points of interest.
                    </li>
                </ul>
              </li>
              <li>
                <strong className="text-gray-900">Points of Interest (POIs):</strong> Foundational data for schools, hospitals, fire stations, and other key urban features are curated from <strong className="text-gray-900">OpenStreetMap (OSM)</strong>, providing a rich context of urban infrastructure.
              </li>
            </ul>
          </div>

          {/* AI & Geoprocessing Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 flex items-center"><BrainCircuit size={24} className="mr-3 text-emerald-500"/>AI & Geoprocessing</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-700">
              <li>
                <strong className="text-gray-900">Context-Aware Advisory:</strong> The application leverages Google's Gemini API to interpret user queries. A detailed system instruction primes the model to act as 'AeroScope AI Planner', an expert urban planning assistant for Dhaka. Before processing a query, the AI receives context about the current map state (e.g., visible layers, selected airbase).
              </li>
              <li>
                <strong className="text-gray-900">Structured Informational Responses:</strong> The AI's role is purely advisory. It is constrained to provide textual analysis and suggestions based on the provided data context. It does <strong className="text-gray-900">not</strong> generate new map layers or geographic data (GeoJSON).
              </li>
              <li>
                <strong className="text-gray-900">Analytical Capabilities:</strong> The AI is designed to perform tasks like summarizing the urban characteristics of a selected area, suggesting plausible locations for new infrastructure in descriptive text, and answering data-related questions based on the visible layers on the map. All outputs are conversational text messages delivered through the AI chat interface.
              </li>
            </ul>
          </div>

          {/* Analysis Techniques Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 flex items-center"><BarChart3 size={24} className="mr-3 text-emerald-500"/>Analysis Techniques</h2>
            <p className="text-gray-600 mb-4">Our analysis adheres to international urban planning standards to ensure that the insights are relevant, accurate, and actionable for assessing safety and infrastructure exposure.</p>
            <ul className="list-disc list-inside space-y-4 text-gray-700">
              <li>
                <strong className="text-gray-900">Zone of Influence Definition:</strong> In line with international aviation planning policies, circular buffers with a <strong className="text-gray-900">7 km radius</strong> were created around each airbase. This defines the primary "airport influence area," where the impacts of noise, emissions, and operational activities are most significant.
              </li>
              <li>
                <strong className="text-gray-900">Temporal Aggregation:</strong> To identify long-term trends and seasonal patterns, raw satellite measurements for NO₂ and NTL were aggregated to compute monthly mean values for each airbase's zone of influence. This allows for consistent month-over-month and year-over-year comparisons of environmental and economic activity trends.
              </li>
              <li>
                 <strong className="text-gray-900">Trend Visualization:</strong> Interactive line charts are used to visualize time-series data, such as environmental metrics and temperature. Users can compare trends across different locations or focus on a single area over time, which helps in identifying long-term patterns, seasonality, and anomalies.
              </li>
               <li>
                 <strong className="text-gray-900">Proximity Analysis:</strong> To assess infrastructure accessibility and risk, the application calculates distances between points of interest (e.g., schools, hospitals) and airbases or other features. This is performed using the Haversine formula (via Leaflet) for accurate great-circle distance measurements.
              </li>
               <li>
                <strong className="text-gray-900">Integrated Assessment:</strong> By combining environmental data (NO₂) with urban activity metrics (NTL) and infrastructure locations (schools, hospitals), the methodology supports a holistic assessment. This enables urban planners to evaluate safety conditions, identify vulnerable areas, and make informed decisions regarding infrastructure development and zoning around these critical airbases.
               </li>
            </ul>
          </div>
          
          {/* Tech Stack */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 flex items-center"><Layers size={24} className="mr-3 text-emerald-500"/>Technology Stack</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-700">
              <li>
                <strong className="text-gray-900">Frontend:</strong> Built with React and TypeScript for a robust, scalable user interface.
              </li>
              <li>
                <strong className="text-gray-900">Mapping:</strong> Utilizes React-Leaflet for interactive map rendering and geospatial operations.
              </li>
              <li>
                <strong className="text-gray-900">AI Integration:</strong> Employs the `@google/genai` SDK to communicate with the Gemini API for generative AI capabilities.
              </li>
               <li>
                <strong className="text-gray-900">Data Visualization:</strong> Charts and graphs on the analysis page are powered by Recharts, a composable charting library for React.
              </li>
              <li>
                <strong className="text-gray-900">Styling:</strong> The user interface is styled with Tailwind CSS for rapid, utility-first design.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MethodologyPage;