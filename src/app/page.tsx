import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Palette, Code } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            ReactBits Studio
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Build stunning, animated landing pages with ReactBits components through our visual drag-and-drop interface
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">90+ Animated Components</h3>
                  <p className="text-gray-600">Access the full ReactBits library with stunning animations and effects</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">No Code Required</h3>
                  <p className="text-gray-600">Create professional landing pages without writing a single line of code</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Palette className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Visual Customization</h3>
                  <p className="text-gray-600">Customize every aspect with intuitive visual controls</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Code className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Clean Code Export</h3>
                  <p className="text-gray-600">Export production-ready React/TypeScript code</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Launch Builder
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="text-center text-gray-600">
            <p className="mb-4">Start with our free tier and upgrade as you grow</p>
            <div className="flex justify-center gap-8">
              <div>
                <span className="font-semibold">Free</span> - 3 projects
              </div>
              <div>
                <span className="font-semibold">Pro</span> - $29/month
              </div>
              <div>
                <span className="font-semibold">Team</span> - $79/month
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}