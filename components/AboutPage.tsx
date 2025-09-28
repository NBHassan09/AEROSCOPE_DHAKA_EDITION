import React from 'react';
import { Info, Droplet, CheckCircle, Map } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <Info size={32} className="text-emerald-500"/>
          <h1 className="text-3xl font-bold text-gray-900">About This App</h1>
        </div>

        <div className="space-y-6 text-gray-700 bg-white p-6 rounded-lg border border-gray-200">
          <p className="leading-relaxed">
            This app was created in response to recent concerns about safety near schools and neighborhoods close to Dhaka’s airbases. It focuses on three key sites—<strong className="text-gray-900">Hazrat Shahjalal International Airport</strong>, <strong className="text-gray-900">Tejgaon Air Base</strong>, and <strong className="text-gray-900">Mirpur Cantonment</strong>—and shows how the areas around them are affected by air quality, traffic, and population density.
          </p>
          
          <div className="flex items-start space-x-4">
            <Droplet className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
            <p>
              We use <strong className="text-gray-900">NASA satellite data</strong> to track air pollution (like nitrogen dioxide), along with maps of traffic and community growth, within a <strong className="text-gray-900">7 km zone</strong> around each base. This zone is widely recognized in urban planning as the “airport influence area,” where noise, safety, and environmental impacts are strongest.
            </p>
          </div>

          <div className="flex items-start space-x-4">
            <CheckCircle className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
            <p>
              The goal is simple: to give planners, city leaders, and residents easy access to reliable information so that communities stay safe, healthy, and well-prepared as Dhaka continues to grow. By bringing science and planning together, the app helps ensure better decisions for the wellbeing of both people and the city’s future.
            </p>
          </div>

          <div className="flex items-center justify-center pt-6 border-t border-gray-200/50">
            <Map size={20} className="text-emerald-500 mr-3 flex-shrink-0" />
            <p className="text-gray-600">
              Ready to explore? Click on the <strong className="font-semibold text-emerald-500">Map</strong> tab to begin your analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;