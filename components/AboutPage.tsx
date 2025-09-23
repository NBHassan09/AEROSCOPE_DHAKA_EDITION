import React from 'react';
import { Info, Droplet, CheckCircle } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-900 text-gray-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <Info size={32} className="text-cyan-400"/>
          <h1 className="text-3xl font-bold text-gray-100">About This App</h1>
        </div>

        <div className="space-y-6 text-gray-300 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <p className="leading-relaxed">
            This app was created in response to recent concerns about safety near schools and neighborhoods close to Dhaka’s airbases. It focuses on three key sites—<strong className="text-white">Hazrat Shahjalal International Airport</strong>, <strong className="text-white">Tejgaon Air Base</strong>, and <strong className="text-white">Mirpur Cantonment</strong>—and shows how the areas around them are affected by air quality, traffic, and population density.
          </p>
          
          <div className="flex items-start space-x-4">
            <Droplet className="text-cyan-400 mt-1 flex-shrink-0" size={20} />
            <p>
              We use <strong className="text-white">NASA satellite data</strong> to track air pollution (like nitrogen dioxide), along with maps of traffic and community growth, within a <strong className="text-white">7 km zone</strong> around each base. This zone is widely recognized in urban planning as the “airport influence area,” where noise, safety, and environmental impacts are strongest.
            </p>
          </div>

          <div className="flex items-start space-x-4">
            <CheckCircle className="text-cyan-400 mt-1 flex-shrink-0" size={20} />
            <p>
              The goal is simple: to give planners, city leaders, and residents easy access to reliable information so that communities stay safe, healthy, and well-prepared as Dhaka continues to grow. By bringing science and planning together, the app helps ensure better decisions for the wellbeing of both people and the city’s future.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
