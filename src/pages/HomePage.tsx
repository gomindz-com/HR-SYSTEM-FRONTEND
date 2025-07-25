import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
            </div>
          </div>
          <span className="text-xl font-semibold text-gray-900">Gomindz </span>
        </div>
        <a href="/login"  className="text-gray-600 hover:text-gray-900">
          Sign in
        </a>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Efficient HR workflows
            <br />
            for modern teams
          </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Streamline your HR processes and manage your team efficiently with easy-to-use workflows designed for modern organizations.
            </p>
          <a href="/company-signup" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full text-lg">
            Get started Now
          </a>
        </div>

        {/* App Preview */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* App Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-900 font-medium">Employee Onboarding 2024</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-1">HR workflow</div>
            </div>

            <div className="flex">
              {/* Left Panel */}
              <div className="w-1/2 bg-gray-50">
                <img src="/hero.jpg" alt="" className="object-cover rounded-tr-3xl h-full w-full" />
                {/* Decorative gradient */}
              </div>

              {/* Right Panel */}
              <div className="w-1/2 p-6 bg-white">
                <div className="bg-gradient-to-br from-pink-100 to-purple-200 rounded-xl p-6 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">What type of workflow?</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">Employee Onboarding</div>
                    </div>

                    <div className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                        <div className="w-4 h-4 bg-gray-400 rounded"></div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">Performance Review</div>
                    </div>

                    <div className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                        <div className="w-4 h-4 bg-gray-400 rounded"></div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">Leave Management</div>
                    </div>

                    <div className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                        <div className="w-4 h-4 bg-gray-400 rounded"></div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">Employee check-in and check-out</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
