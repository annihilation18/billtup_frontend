import { FileText } from 'lucide-react@0.468.0';
import { Card } from '../ui/card';

export function ChangelogSection() {
  const updates = [
    { date: 'Nov 2024', version: 'v2.1.0', changes: ['Added refund management', 'Improved sales analytics', 'Fixed PDF generation bugs'] },
    { date: 'Oct 2024', version: 'v2.0.0', changes: ['Launched premium plan features', 'Added customer invoice history', 'Improved mobile responsive'] },
    { date: 'Sep 2024', version: 'v1.5.0', changes: ['Added tax support', 'Email receipt improvements', 'Performance optimizations'] },
  ];

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#1E3A8A]/10 rounded-full px-4 py-2 mb-4">
            <FileText className="w-4 h-4 text-[#1E3A8A]" />
            <span className="text-sm text-[#1E3A8A]">Changelog</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Product Updates
          </h1>
          
          <p className="text-xl text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Stay updated with the latest improvements and features
          </p>
        </div>

        <div className="space-y-6">
          {updates.map((update, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm text-gray-500">{update.date}</span>
                <span className="px-3 py-1 bg-[#14B8A6]/10 text-[#14B8A6] rounded-full text-sm">{update.version}</span>
              </div>
              <ul className="space-y-2">
                {update.changes.map((change, cIndex) => (
                  <li key={cIndex} className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#14B8A6] mt-1">•</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}