import Header from "@/components/header";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";
import { Shield, Target, Users, Award, CheckCircle, MapPin, Mail, Calendar } from "lucide-react";

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <SEOHead
                title="About Us | GovtJobNow — India's Trusted Government Job Portal"
                description="Learn about GovtJobNow — India's trusted platform for government job notifications, exam calendars, and career guidance. Founded in 2024, we help millions of aspirants find verified Sarkari Naukri opportunities."
                url="https://govtjobnow.com/about-us"
            />
            <Header />

            {/* Hero Section */}
            <div className="page-hero mb-10" style={{ borderRadius: '0 0 20px 20px' }}>
                <div className="max-w-4xl mx-auto text-center">
                    <h1>About GovtJobNow</h1>
                    <p>
                        India's most trusted and reliable portal for government job notifications,
                        exam calendars, and career guidance. We bridge the gap between talented
                        candidates and their dream government careers.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <main className="max-w-4xl mx-auto px-4 py-16">

                {/* Quick Facts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    {[
                        { label: "Founded", value: "2024", icon: "📅" },
                        { label: "Jobs Published", value: "1,000+", icon: "💼" },
                        { label: "Monthly Users", value: "2,000+", icon: "👥" },
                        { label: "Verified Posts", value: "100%", icon: "✅" },
                    ].map(({ label, value, icon }) => (
                        <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 text-center shadow-sm">
                            <div className="text-3xl mb-2">{icon}</div>
                            <p className="text-2xl font-extrabold text-blue-600">{value}</p>
                            <p className="text-sm text-gray-500 mt-1">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Our Story */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Our Story</h2>
                    <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400 space-y-4">
                        <p>
                            GovtJobNow was founded in 2024 in Indore, Madhya Pradesh, by a team of professionals
                            who personally experienced the frustration of finding reliable government job information
                            online. Scattered notifications, outdated exam dates, and unverified sources cost
                            thousands of aspirants their dream opportunities.
                        </p>
                        <p>
                            We set out to fix that. Starting with a small editorial team of three, we began
                            manually verifying every notification directly against official government sources —
                            NIC portals, official press releases, and recruitment board websites.
                        </p>
                        <p>
                            Today, GovtJobNow serves thousands of government job aspirants across India, covering
                            opportunities in SSC, UPSC, Railways, Banking, PSUs, Defence, and State Government
                            departments. Our AI-assisted verification pipeline, combined with human editorial oversight,
                            ensures every piece of information you read here is accurate and timely.
                        </p>
                    </div>
                </section>

                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
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
                            To be the definitive, go-to platform for every government job aspirant in India.
                            We envision a future where finding and applying for government roles is a seamless,
                            stress-free experience driven by technology and trust.
                        </p>
                    </div>
                </div>

                {/* Editorial Team */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-gray-100">Our Editorial Team</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                name: "Girjesh Suryawanshi",
                                role: "Founder & Editor-in-Chief",
                                bio: "Former government exam aspirant with deep expertise in SSC, UPSC, and state recruitment processes. 5+ years of experience in education journalism.",
                                initials: "GS",
                                color: "bg-blue-600"
                            },
                            {
                                name: "GovtJobNow Editorial Team",
                                role: "Verification & Research",
                                bio: "A team of researchers and former educators who cross-verify every notification against official sources before publication.",
                                initials: "ET",
                                color: "bg-indigo-600"
                            },
                            {
                                name: "Content & Exam Specialists",
                                role: "Exam Guides & Strategy",
                                bio: "Subject matter experts covering SSC CGL, IBPS, Railway, and UPSC syllabi with in-depth preparation articles and strategy guides.",
                                initials: "CS",
                                color: "bg-purple-600"
                            },
                        ].map(({ name, role, bio, initials, color }) => (
                            <div key={name} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                                <div className={`${color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                                    <span className="text-xl font-black text-white">{initials}</span>
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{name}</h3>
                                <p className="text-sm text-blue-600 font-medium mb-3">{role}</p>
                                <p className="text-sm text-gray-500 leading-relaxed">{bio}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Why Trust Us (E-E-A-T Focus) */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-gray-100">Why Thousands Trust Us</h2>

                    <div className="space-y-6">
                        <div className="flex gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className="flex-shrink-0 mt-1">
                                <Shield className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">100% Verified Information</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Every job posting, exam date, and syllabus on our platform goes through a rigorous
                                    multi-tier verification process. Our editorial team fact-checks data directly against
                                    official government notifications and press releases before publishing.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className="flex-shrink-0 mt-1">
                                <CheckCircle className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">AI-Powered Accuracy</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    We utilize advanced AI technology to extract, organize, and simplify complex
                                    government notifications. This ensures our users get the critical information
                                    (eligibility, deadlines, vacancies) instantly and without errors. Every AI output
                                    is reviewed by a human editor before going live.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className="flex-shrink-0 mt-1">
                                <Users className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Dedicated Editorial Standards</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Our team comprises professionals with hands-on experience in government exam preparation
                                    and education journalism. We follow strict editorial policies — all corrections are
                                    transparently logged, and our verification standards are published openly.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Location & Contact Info */}
                <div className="bg-blue-50 dark:bg-gray-800 rounded-3xl p-8 mb-10 grid md:grid-cols-3 gap-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <MapPin className="h-6 w-6 text-blue-600" />
                        <p className="font-bold text-gray-900 dark:text-gray-100">Office</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Polo Ground, Industrial Estate<br />Indore, MP - 452006, India</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Mail className="h-6 w-6 text-blue-600" />
                        <p className="font-bold text-gray-900 dark:text-gray-100">Email</p>
                        <a href="mailto:support@govtjobnow.com" className="text-sm text-blue-600 hover:underline">support@govtjobnow.com</a>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Calendar className="h-6 w-6 text-blue-600" />
                        <p className="font-bold text-gray-900 dark:text-gray-100">Founded</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">2024 · Indore, India</p>
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-8 md:p-12 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Got Questions or Feedback?</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                        We are constantly striving to improve GovtJobNow. If you have suggestions, spot an error,
                        or just want to get in touch with our team, we are always listening.
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
