// src/app/assessment/_components/DomainRenderer.tsx
import { type Domain } from '~/lib/socmm-schema';
import { SubdomainRenderer } from './SubdomainRenderer';

export const DomainRenderer = ({ domain }: { domain: Domain }) => {
  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-extrabold text-gray-800 border-b pb-4">
        {domain.name} Domain
      </h1>
      {domain.subdomains.map((subdomain) => (
        <SubdomainRenderer key={subdomain.id} subdomain={subdomain} />
      ))}
    </div>
  );
};