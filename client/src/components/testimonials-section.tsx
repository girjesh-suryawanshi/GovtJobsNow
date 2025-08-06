import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Selected for SBI PO",
      location: "Delhi",
      content: "GovtJobsNow's job alerts helped me stay ahead of the competition. I got notified about the SBI PO opening within minutes of posting and was able to apply early. The application tracker kept me organized throughout the process.",
      rating: 5,
      avatar: "PS"
    },
    {
      name: "Rajesh Kumar", 
      role: "SSC CGL Qualified",
      location: "Mumbai",
      content: "The exam calendar feature is a game-changer! I never missed any important dates and the syllabus breakdown helped me prepare strategically. Finally got selected in SSC CGL after 3 years of trying.",
      rating: 5,
      avatar: "RK"
    },
    {
      name: "Anjali Singh",
      role: "Railway Recruitment",
      location: "Pune", 
      content: "I was overwhelmed by the number of government job sites until I found GovtJobsNow. Everything I need is in one place - alerts, tracking, comparisons. Got selected for Railway recruitment in just 4 months!",
      rating: 5,
      avatar: "AS"
    },
    {
      name: "Vikram Patel",
      role: "UPSC CSE Qualified",
      location: "Bangalore",
      content: "The job comparison feature helped me analyze different opportunities and make informed decisions. The real-time updates meant I never missed application deadlines. Highly recommend for serious job seekers.",
      rating: 5,
      avatar: "VP"
    },
    {
      name: "Meera Iyer",
      role: "Bank PO Selected", 
      location: "Chennai",
      content: "As a working professional, I needed something that could keep track of multiple applications. The application tracker with progress indicators was exactly what I needed. Got selected in my dream bank!",
      rating: 5,
      avatar: "MI"
    },
    {
      name: "Suresh Gupta",
      role: "Defence Services",
      location: "Lucknow",
      content: "The floating action menu makes it so easy to access all features quickly. I could set up alerts, track applications, and check exam dates seamlessly. User experience is outstanding!",
      rating: 5,
      avatar: "SG"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Successful Placements" },
    { number: "98%", label: "User Satisfaction" },
    { number: "25+", label: "Government Sources" },
    { number: "4.9/5", label: "Average Rating" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Stats */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Trusted by Thousands of
            <span className="text-green-600 ml-2">Successful Job Seekers</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="h-12 w-12 text-blue-600" />
                </div>

                {/* Rating */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-gray-500">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join the Success Stories
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Don't just search for jobs - get the competitive advantage that helps you land your dream government position
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              Start Your Success Journey
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}