import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, CheckCircle } from 'lucide-react';

const TermsConditions = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#050510] relative overflow-hidden text-gray-300 font-sans selection:bg-neon-blue/30 selection:text-white pb-20">
            {/* Background Ambient Glow */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-purple/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12 animate-fade-in">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-neon-blue hover:text-white transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Back</span>
                    </button>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-neon-blue/10 rounded-xl border border-neon-blue/20 shadow-neon">
                            <Shield className="w-8 h-8 text-neon-blue" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Conditions</span>
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
                        Welcome to Athanuramman Fencing. Please read these terms carefully before using our services.
                    </p>
                    <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400">
                        <ClockIcon className="w-4 h-4 mr-2" />
                        Last Updated: {new Date().toLocaleDateString()}
                    </div>
                </div>

                {/* Content Container */}
                <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl animate-slide-in space-y-12">

                    {/* Section 1 */}
                    <Section number="01" title="Acceptance of Terms">
                        <p>By using our website or services, you confirm that you are at least 18 years old or using the site under supervision of a parent/guardian.</p>
                        <p>These terms apply to all visitors, customers, and users of this website. If you do not agree with any part of these terms, please do not use our website or services.</p>
                    </Section>

                    {/* Section 2 */}
                    <Section number="02" title="Services Offered">
                        <p className="mb-4">Our website provides fencing-related services including:</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <ListItem>Fence installation</ListItem>
                            <ListItem>Fence repair and maintenance</ListItem>
                            <ListItem>Material sales</ListItem>
                            <ListItem>Quotation requests</ListItem>
                            <ListItem>Project management and scheduling</ListItem>
                            <ListItem>Customer support</ListItem>
                        </ul>
                        <p className="mt-4 text-sm text-gray-500 italic">We reserve the right to modify, update, or discontinue any service at any time without prior notice.</p>
                    </Section>

                    {/* Section 3 */}
                    <Section number="03" title="Quotes & Pricing">
                        <ul className="space-y-2">
                            <ListItem>All prices or quotations provided on this website are estimates only.</ListItem>
                            <ListItem>Final pricing may vary based on site conditions, material availability, measurements, and additional requirements.</ListItem>
                            <ListItem>Quotes are valid only for a specific period mentioned in the quotation.</ListItem>
                        </ul>
                    </Section>

                    {/* Section 4 */}
                    <Section number="04" title="Appointment Booking & Scheduling">
                        <p className="mb-2">When booking a service or site visit:</p>
                        <ul className="space-y-2">
                            <ListItem>You must provide accurate information.</ListItem>
                            <ListItem>We may reschedule appointments due to unforeseen circumstances such as weather or material delays.</ListItem>
                            <ListItem>You will be notified in advance of any changes.</ListItem>
                        </ul>
                    </Section>

                    {/* Section 5 */}
                    <Section number="05" title="Payments & Refunds">
                        <ul className="space-y-2">
                            <ListItem>Payment terms will be clearly stated in invoices or quotations.</ListItem>
                            <ListItem>Advance payments (if applicable) are non-refundable, unless otherwise stated.</ListItem>
                            <ListItem>Refunds for cancelled services will follow our company’s cancellation policy.</ListItem>
                            <ListItem>We reserve the right to cancel orders or services if fraudulent or suspicious activity is detected.</ListItem>
                        </ul>
                    </Section>

                    {/* Section 6 */}
                    <Section number="06" title="User Responsibilities">
                        <p className="mb-2">You agree not to:</p>
                        <ul className="space-y-2">
                            <ListItem>Use the website for illegal or harmful purposes.</ListItem>
                            <ListItem>Distribute or upload malicious content (viruses, malware, scripts).</ListItem>
                            <ListItem>Attempt to hack, disrupt, or reverse-engineer any part of the website.</ListItem>
                            <ListItem>Provide false, inaccurate, or misleading information.</ListItem>
                        </ul>
                    </Section>

                    {/* Section 7 */}
                    <Section number="07" title="Accuracy of Information">
                        <p>We strive to ensure all information on this website is accurate and current. However, we:</p>
                        <ul className="space-y-2 mt-2">
                            <ListItem>Do not guarantee completeness or accuracy of any content.</ListItem>
                            <ListItem>Reserve the right to correct errors or update information without prior notice.</ListItem>
                        </ul>
                    </Section>

                    {/* Section 8 */}
                    <Section number="08" title="Intellectual Property Rights">
                        <p>All content on this website—including text, images, logos, designs, and software—is the property of <strong>Athanuramman Fencings</strong>.</p>
                        <p>Users may not copy, reproduce, or distribute any content without written permission.</p>
                    </Section>

                    {/* Section 9 */}
                    <Section number="09" title="Third-Party Links">
                        <p>Our website may contain links to third-party websites. We are not responsible for their content, privacy practices, or any loss or damage caused by using them. You access third-party sites at your own risk.</p>
                    </Section>

                    {/* Section 10 & 11 */}
                    <Section number="10" title="Limitation of Liability & Warranty">
                        <p className="mb-4">To the fullest extent permitted by law, Athanuramman Fencings is not liable for any direct, indirect, or consequential damages, loss of data, profits, or business opportunities.</p>
                        <p>Our website and services are provided “as is” and “as available”. We do not guarantee uninterrupted website operation, error-free content, or complete security of user data.</p>
                    </Section>

                    {/* Section 12, 13, 14 */}
                    <Section number="11" title="Legal & Policy">
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-white font-semibold mb-2">Privacy Policy</h4>
                                <p>Your use of the website is also governed by our Privacy Policy. Please review it to understand how we collect and use your information.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-semibold mb-2">Changes to Terms</h4>
                                <p>We may modify these Terms & Conditions at any time. Updates take effect immediately once posted. Continued use of the website means you accept the updated terms.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-semibold mb-2">Governing Law</h4>
                                <p>These Terms & Conditions are governed by the laws of India. Any disputes will be handled in the courts of Tirupur District.</p>
                            </div>
                        </div>
                    </Section>

                    {/* Contact Section */}
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/5 rounded-2xl p-6 border border-white/5">
                            <div>
                                <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Phone</p>
                                <p className="text-white font-mono text-lg">73736 78796</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Email</p>
                                <p className="text-white font-mono text-lg">athanurammanfencings@gmail.com</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Address</p>
                                <p className="text-white">17/295, Othakkadai, Sakthipalayam (Post) Tirchy Road, VELLAKOVIL - 638 111. Tirupur Dist.</p>
                                <p className="text-white mt-1">IBP Bunk Near, Kovai Road, KANGAYAM - 638 701.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// Helper Components for clean code
const Section = ({ number, title, children }) => (
    <div className="relative pl-0 md:pl-0">
        <div className="flex items-baseline gap-4 mb-4">
            <span className="text-neon-blue font-mono text-sm font-bold opacity-60">
                {number}
            </span>
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
        </div>
        <div className="text-gray-400 leading-relaxed pl-8 md:pl-10 space-y-3">
            {children}
        </div>
    </div>
);

const ListItem = ({ children }) => (
    <li className="flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-neon-purple shrink-0 mt-0.5" />
        <span>{children}</span>
    </li>
);

// Icon component needed for the layout (added inline to avoid extra import if not available)
const ClockIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default TermsConditions;
