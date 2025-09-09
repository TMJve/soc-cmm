// src/app/assessment/_components/DomainRenderer.tsx
'use client';

import { type Domain } from '~/lib/socmm-schema';
import { SubdomainRenderer } from './SubdomainRenderer';

export const DomainRenderer = ({ domain }: { domain: Domain }) => {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-2 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-800">{domain.name}</h1>
        
        {/* NEW: This displays the tooltip icon if tooltip text exists */}
        {domain.domainTooltipText && (
          <div title={domain.domainTooltipText} className="cursor-help">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* NEW: This displays the link if a URL exists */}
      {domain.domainLearnMoreUrl && (
        <a 
          href={domain.domainLearnMoreUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-blue-600 hover:underline mb-4 inline-block"
        >
          Learn more about the {domain.name} domain...
        </a>
      )}

      {domain.subdomains.map((subdomain) => (
        <SubdomainRenderer key={subdomain.id} subdomain={subdomain} />
      ))}
    </div>
  );
};