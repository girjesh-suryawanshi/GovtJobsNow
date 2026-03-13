import Header from "@/components/header";
import Footer from "@/components/footer";
import { Shield, Target, Users, Award, CheckCircle } from "lucide-react";

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">About GovtJobsNow</h1>
                    <p className="text-xl text-blue-100 leading-relaxed">
                        India's most trusted and reliable portal for government job notifications,
                        exam calendars, and career guidance. We bridge the gap between talented
                        candidates and their dream government careers.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <main className="max-w-4xl mx-auto px-4 py-16">

                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="bg-blue-100 dark:bg-blue-900/50 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                            <Target className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Our Mission</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            To provide accurate, timely, and comprehensive information about government
                            opportunities across India. We aim to democratize access to career-defining
                            information for aspirants from all backgrounds, empowering them to make
                            informed decisions about their futures.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="bg-indigo-100 dark:bg-indigo-900/50 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                            <Award className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Our Vision</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            To be the definitive, go-to platform for every single government job aspirant in India.
                            We envision a future where finding and applying for government roles is a seamless,
                            stress-free experience driven by technology and trust.
                        </p>
                    </div>
                </div>

                {/* Why Trust Us (E-E-A-T Focus) */}
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">Why Millions Trust Us</h2>

                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 mt-1">
                                <Shield className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">100% Verified Information</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Every job posting, exam date, and syllabus on our platform goes through a rigorous multi-tier verification process. Our editorial team fact-checks data directly against official government notifications and press releases before publishing.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 mt-1">
                                <CheckCircle className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">AI-Powered Accuracy</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    We utilize advanced AI technology to securely extract, organize, and simplify complex government notifications. This ensures our users get the critical information they need (like eligibility and deadlines) instantly and without errors.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 mt-1">
                                <Users className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Dedicated Editorial Team</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Our team comprises veteran educators, former government employees, and seasoned researchers who understand the intricacies of the Indian government recruitment landscape. We are real people dedicated to your success.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact CTA */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-8 md:p-12 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Got Questions or Feedback?</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                        We are constantly striving to improve GovtJobsNow. If you have suggestions, spot an error, or just want to get in touch with our team, we are always listening.
                    </p>
                    <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                        Contact Us Today
                    </a>
                </div>
            </main>

            <Footer />
        </div>
    );
}
