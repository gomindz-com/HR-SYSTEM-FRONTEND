import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Clock, Calendar, CheckCircle, Star, Zap, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
            </div>
          </div>
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Gomindz
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <a href="/login" className="hidden sm:block text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Sign in
          </a>
          <a href="/login" className="sm:hidden text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Login
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4 mr-2" />
            Trusted by 1000+ companies worldwide
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Efficient HR workflows
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              for modern teams
            </span>
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Streamline your HR processes and manage your team efficiently with easy-to-use workflows designed for modern organizations.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a 
              href="/company-signup" 
              className="group bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              Get started Now
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="/login" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center"
            >
              Already have an account?
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 shadow-sm hover:shadow-md transition-all">
              <Users className="w-8 h-8 text-blue-600 mb-3 mx-auto" />
              <h3 className="font-semibold text-gray-900 mb-2">Employee Management</h3>
              <p className="text-sm text-gray-600">Comprehensive employee profiles and data management</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 shadow-sm hover:shadow-md transition-all">
              <Clock className="w-8 h-8 text-green-600 mb-3 mx-auto" />
              <h3 className="font-semibold text-gray-900 mb-2">Attendance Tracking</h3>
              <p className="text-sm text-gray-600">QR-based check-in/out with real-time monitoring</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 shadow-sm hover:shadow-md transition-all">
              <Calendar className="w-8 h-8 text-purple-600 mb-3 mx-auto" />
              <h3 className="font-semibold text-gray-900 mb-2">Leave Management</h3>
              <p className="text-sm text-gray-600">Streamlined leave requests and approvals</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 shadow-sm hover:shadow-md transition-all">
              <Shield className="w-8 h-8 text-orange-600 mb-3 mx-auto" />
              <h3 className="font-semibold text-gray-900 mb-2">Secure & Compliant</h3>
              <p className="text-sm text-gray-600">Enterprise-grade security and compliance</p>
            </div>
          </div>
        </div>

        {/* App Preview */}
        <div className="relative max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* App Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-4 sm:px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-900 font-semibold text-sm sm:text-base">Employee Onboarding 2024</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">HR workflow • Active</div>
            </div>

            <div className="flex flex-col lg:flex-row">
              {/* Left Panel */}
              <div className="lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-600/10"></div>
                <img 
                  src="/hero.jpg" 
                  alt="HR Management Interface" 
                  className="relative object-cover h-64 lg:h-full w-full rounded-br-3xl lg:rounded-br-none lg:rounded-tr-3xl" 
                />
                {/* Overlay content */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Workflow Complete</h4>
                      <p className="text-xs text-gray-600">Employee onboarding finished</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel */}
              <div className="lg:w-1/2 p-4 sm:p-6 lg:p-8 bg-white">
                <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-2xl p-4 sm:p-6 h-full border border-pink-100">
                  <div className="flex items-center space-x-2 mb-6">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">What type of workflow?</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border border-white/50 hover:border-blue-200 group">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">Employee Onboarding</div>
                      <div className="text-xs text-gray-500 mt-1">Streamlined process</div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border border-white/50 hover:border-green-200 group">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
                        <Star className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">Performance Review</div>
                      <div className="text-xs text-gray-500 mt-1">360° feedback</div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border border-white/50 hover:border-purple-200 group">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                        <Calendar className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">Leave Management</div>
                      <div className="text-xs text-gray-500 mt-1">Automated approvals</div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border border-white/50 hover:border-orange-200 group">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
                        <Clock className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">Attendance Tracking</div>
                      <div className="text-xs text-gray-500 mt-1">QR-based system</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-6 pt-6 border-t border-purple-100">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">98%</div>
                        <div className="text-xs text-gray-600">Success Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">2.5x</div>
                        <div className="text-xs text-gray-600">Faster</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">24/7</div>
                        <div className="text-xs text-gray-600">Support</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating elements for visual appeal */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-200 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-purple-200 rounded-full opacity-60 animate-pulse delay-1000"></div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16 lg:mt-20">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 lg:p-12 text-white">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Ready to transform your HR processes?
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of companies that trust Gomindz for their HR management needs.
            </p>
            <a 
              href="/company-signup" 
              className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-lg"
            >
              Start your free trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
