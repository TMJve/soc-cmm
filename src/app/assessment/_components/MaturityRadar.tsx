'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { Results } from '~/lib/scoring';
import { assessmentModel } from '~/lib/socmm-schema';

interface MaturityRadarProps {
  results: Results;
}

export default function MaturityRadar({ results }: MaturityRadarProps) {
  // 1. Flatten the hierarchical data into a single array for the chart
  // We iterate through the Schema to ensure the sort order matches the official tool
  const data = assessmentModel.flatMap((domain) => {
    return domain.subdomains.map((subdomain) => {
      // Safely access the score we calculated
      const score = results[domain.id]?.subdomains[subdomain.id]?.score || 0;
      
      return {
        // Create a label like "Business Drivers"
        subject: subdomain.name,
        score: score,
        fullMark: 5,
        domainName: domain.name, // useful for tooltips
      };
    });
  });

  return (
    <div className="h-[500px] w-full bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
        Maturity Profile
      </h3>
      
      <div className="flex-grow min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            {/* The spider web background */}
            <PolarGrid stroke="#e5e7eb" />
            
            {/* The Labels (Subdomain Names) */}
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 500 }}
            />
            
            {/* The Axis Numbers (0, 1, 2, 3, 4, 5) */}
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 5]} 
              tickCount={6} 
              tick={{ fill: '#9ca3af', fontSize: 10 }} 
            />
            
            {/* The Blue Shape */}
            <Radar
              name="Maturity Score"
              dataKey="score"
              stroke="#2563eb" // Blue-600
              strokeWidth={3}
              fill="#3b82f6"   // Blue-500
              fillOpacity={0.4}
            />
            
            <Tooltip 
            contentStyle={{ 
                backgroundColor: '#fff', 
                borderRadius: '8px', 
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
            }}
            itemStyle={{ color: '#1f2937', fontWeight: 600 }}
            // FIX: Accept 'any' or check for undefined to satisfy TypeScript
            formatter={(value: number | string | undefined) => [
                Number(value || 0).toFixed(2), 
                'Score'
            ]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}