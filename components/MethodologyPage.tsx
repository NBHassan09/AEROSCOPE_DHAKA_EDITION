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
            <p className="text-gray-600 mb-4">To evaluate the urban environment and safety conditions around the three key airbases, we collected and processed satellite-derived and geospatial datasets for the period 2019–2024.</p>
            <ul className="list-disc list-inside space-y-4 text-gray-700">
              <li>
                <strong className="text-gray-900">Nitrogen Dioxide (NO₂) Concentrations:</strong> Sourced from the <strong className="text-gray-900">NASA Sentinel-5P dataset (COPERNICUS/S5P/NRTI/L3_NO2)</strong>. Data was obtained via the Google Earth Engine (GEE) Python API, providing daily tropospheric NO₂ column densities at an approximate <strong className="text-gray-900">7 km spatial resolution</strong>. This serves as a primary indicator for air quality and pollution from traffic and industrial sources.
              </li>
              <li>
                <strong className="text-gray-900">Traffic & Urban Activity:</strong> Traffic congestion patterns and urban activity levels were derived from <strong className="text-gray-900">NASA Earth Observation urban mobility indicators</strong> and <strong className="text-gray-900">VIIRS Nighttime Lights (NTL)</strong> data. These datasets, combined with global road network data, quantify relative congestion levels and economic activity around each airbase.
              </li>
               <li>
                <strong className="text-gray-900">Urban Heat Island (LST):</strong> Land Surface Temperature data, derived from <strong className="text-gray-900">NASA's MODIS or Landsat satellites</strong>, is used to model the urban heat island effect. This provides a heatmap of temperature variations across the city, crucial for assessing public health risks.
              </li>
              <li>
                <strong className="text-gray-900">Particulate Matter Pollution (AOD):</strong> Aerosol Optical Depth from <strong className="text-gray-900">NASA's MODIS or VIIRS sensors</strong> serves as a proxy for fine particulate matter (PM2.5). This layer provides a more complete picture of air quality beyond gaseous pollutants.
              </li>
              <li>
                <strong className="text-gray-900">Urban Greenness (NDVI):</strong> The Normalized Difference Vegetation Index (NDVI) from <strong className="text-gray-900">Landsat or MODIS</strong> measures the density and health of vegetation. This allows for the identification of areas lacking green space, which is critical for quality of life and heat mitigation.
              </li>
              <li>
                <strong className="text-gray-900">Geographic Base Layers & POIs:</strong> The base map tiles are provided by CartoDB via OpenStreetMap. Foundational data for schools, hospitals, fire stations, and other points of interest are curated from OpenStreetMap (OSM) to provide a rich context of urban infrastructure.
              </li>
            </ul>
          </div>

          {/* AI & Geoprocessing Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 flex items-center"><BrainCircuit size={24} className="mr-3 text-emerald-500"/>AI & Geoprocessing</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-700">
              <li>
                <strong className="text-gray-900">Natural Language to GeoJSON:</strong> The application leverages Google's Gemini API to interpret user queries. A detailed system instruction primes the model to act as an expert urban planner for Dhaka.
              </li>
              <li>
                <strong className="text-gray-900">Structured Output:</strong> The AI is constrained to produce structured JSON output conforming to a specific schema. This ensures that when a user requests geographic data, the response is a valid GeoJSON FeatureCollection that can be directly rendered on the map.
              </li>
              <li>
                <strong className="text-gray-900">Plausible Data Generation:</strong> For queries where precise data is unavailable, the AI is instructed to generate realistic and contextually plausible geographic data, enabling exploratory analysis.
              </li>
            </ul>
          </div>

          {/* Analysis Techniques Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 flex items-center"><BarChart3 size={24} className="mr-3 text-emerald-500"/>Analysis Techniques</h2>
            <p className="text-gray-600 mb-4">Our analysis adheres to international urban planning standards to ensure that the insights are relevant, accurate, and actionable for assessing safety and infrastructure exposure.</p>
            <ul className="list-disc list-inside space-y-4 text-gray-700">
              <li>
                <strong className="text-gray-900">Zone of Influence Definition:</strong> In line with international aviation planning policies, circular buffers with a <strong className="text-gray-900">7 km radius</strong> were created around each airbase. This defines the primary "airport influence area," where the impacts of noise, emissions, and operational activities are most significant. Only observations within these buffers were retained for analysis.
              </li>
              <li>
                <strong className="text-gray-900">Temporal Aggregation:</strong> To identify long-term trends and seasonal patterns, daily NO₂ values were aggregated to compute monthly and annual mean concentrations. Similarly, traffic and NTL indicators were summarized per buffer zone per year, allowing for consistent year-over-year comparisons.
              </li>
               <li>
                 <strong className="text-gray-900">Proximity Analysis:</strong> To assess infrastructure accessibility and risk, the application calculates distances between points of interest (e.g., schools, hospitals) and airbases or other features. This is performed using the Haversine formula (via Leaflet) for accurate great-circle distance measurements.
              </li>
               <li>
                <strong className="text-gray-900">Integrated Assessment:</strong> By combining environmental data (NO₂) with urban activity metrics (NTL, traffic indices) and infrastructure locations (schools, hospitals), the methodology supports a holistic assessment. This enables urban planners to evaluate safety conditions, identify vulnerable areas, and make informed decisions regarding infrastructure development and zoning around these critical airbases.
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