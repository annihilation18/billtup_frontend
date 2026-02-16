import { Map, CheckCircle2, Clock, Lightbulb } from 'lucide-react@0.468.0';
import { Card } from '../ui/card';

export function RoadmapSection() {
  const roadmapItems = [
    { status: 'completed', title: 'Invoice Management', description: 'Create, send, and track invoices', icon: CheckCircle2, color: 'text-green-600' },
    { status: 'completed', title: 'Payment Processing', description: 'Optional online payments via Stripe integration', icon: CheckCircle2, color: 'text-green-600' },
    { status: 'completed', title: 'Mobile Apps', description: 'Native iOS and Android applications', icon: CheckCircle2, color: 'text-green-600' },
    { status: 'in-progress', title: 'Recurring Invoices', description: 'Automate subscription billing', icon: Clock, color: 'text-blue-600' },
    { status: 'planned', title: 'Team Collaboration', description: 'Multi-user accounts with role permissions', icon: Lightbulb, color: 'text-gray-400' },
  ];

  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 rounded-full px-4 py-2 mb-4">
            <Map className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-sm text-[#F59E0B]">Product Roadmap</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            What's Next for BilltUp
          </h1>
          
          <p className="text-xl text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            See what we're building and what's coming next
          </p>
        </div>

        <div className="space-y-4">
          {roadmapItems.map((item, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {item.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'completed' ? 'bg-green-100 text-green-700' :
                      item.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {item.status === 'completed' ? 'Completed' : item.status === 'in-progress' ? 'In Progress' : 'Planned'}
                    </span>
                  </div>
                  <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}