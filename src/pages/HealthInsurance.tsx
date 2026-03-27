import { useState } from 'react';
import { Shield, Check, ArrowRight, Star, Loader2, IndianRupee, CreditCard, Smartphone, Building2, QrCode } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const plans = [
    {
        name: "Basic Care",
        price: 349,
        description: "Perfect for students and young professionals",
        features: [
            "Hospitalization cover up to ₹2 Lakhs",
            "Pre & post hospitalization cover",
            "Day care treatments",
            "Cashless at 5000+ hospitals"
        ],
        color: "from-blue-500 to-cyan-500"
    },
    {
        name: "Family Plus",
        price: 899,
        description: "Comprehensive cover for your entire family",
        features: [
            "Hospitalization cover up to ₹10 Lakhs",
            "Annual health check-ups",
            "OPD consultations included",
            "Maternity cover after 2 years"
        ],
        color: "from-teal-500 to-emerald-500",
        popular: true
    },
    {
        name: "Elite Secure",
        price: 1499,
        description: "Ultimate protection with worldwide coverage",
        features: [
            "Unlimited hospitalization cover",
            "Worldwide emergency cover",
            "Personal accident insurance",
            "No claim bonus up to 100%"
        ],
        color: "from-purple-500 to-indigo-500"
    }
];

export default function HealthInsurance() {
    const { user } = useAuth();
    const [loading, setLoading] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
    const [formData, setFormData] = useState({
        applicantName: '',
        applicantAge: '',
        applicantAddress: '',
        paymentMethod: 'card'
    });
    const [upiId, setUpiId] = useState('');

    const handleApplyClick = (plan: typeof plans[0]) => {
        if (!user) {
            setMessage({ type: 'error', text: 'Please login to apply for insurance.' });
            return;
        }
        setSelectedPlan(plan);
        setFormData({
            applicantName: user.name || '',
            applicantAge: '',
            applicantAddress: '',
            paymentMethod: 'card'
        });
        setUpiId('');
        setMessage(null);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlan) return;

        setLoading(selectedPlan.name);
        setMessage(null);

        try {
            await api.post('/insurance/apply', {
                planName: selectedPlan.name,
                price: selectedPlan.price,
                applicantName: formData.applicantName,
                applicantAge: parseInt(formData.applicantAge),
                applicantAddress: formData.applicantAddress,
                paymentMethod: formData.paymentMethod
            });
            setMessage({ type: 'success', text: `Successfully applied for ${selectedPlan.name}!` });
            setSelectedPlan(null);
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to submit application. Please try again.' });
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-24 pb-12 px-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 rounded-3xl mb-6 border border-blue-500/30">
                        <Shield className="w-10 h-10 text-blue-400" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                        <span className="bg-gradient-to-r from-blue-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">
                            Smart Health Insurance
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Secure your family's future with our AI-powered insurance plans.
                        Comprehensive coverage starting from just <span className="text-white font-bold inline-flex items-center ml-1"><IndianRupee className="w-4 h-4 mr-1" />349/month</span>.
                    </p>
                </div>

                {message && (
                    <div className={`max-w-2xl mx-auto mb-12 p-4 rounded-2xl border flex items-center gap-3 animate-fade-in ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${message.type === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                            }`}>
                            {message.type === 'success' ? <Check className="w-5 h-5" /> : <Star className="w-5 h-5" />}
                        </div>
                        <p className="font-medium">{message.text}</p>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative group rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 ${plan.popular ? 'border-blue-500/50 scale-105' : ''
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{plan.description}</p>
                            </div>

                            <div className="mb-8 flex items-baseline gap-1">
                                <span className="text-4xl font-black">₹{plan.price}</span>
                                <span className="text-slate-500">/month</span>
                            </div>

                            <div className="space-y-4 mb-8">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-center gap-3 group/item">
                                        <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 group-hover/item:bg-blue-500 group-hover/item:text-white transition-colors duration-300">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span className="text-slate-300 text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleApplyClick(plan)}
                                disabled={!!loading}
                                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group/btn transition-all duration-300 overflow-hidden relative ${plan.popular
                                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 hover:shadow-lg hover:shadow-blue-500/50'
                                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                    }`}
                            >
                                {loading === plan.name ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Apply Now</span>
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-24 rounded-3xl bg-gradient-to-br from-blue-600/20 to-teal-600/20 border border-blue-500/20 p-12 text-center backdrop-blur-3xl animate-fade-in">
                    <h2 className="text-3xl font-bold mb-4">Why choose AI Health Insurance?</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto mb-8">
                        Our platform uses advanced AI algorithms to analyze your health profile and recommend the most suitable coverage, ensuring you never overpay for what you don't need.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        {[
                            { title: "24/7 AI Support", desc: "Get instant answers to your complex claim queries via our mental health AI module." },
                            { title: "Paperless Claims", desc: "Submit and track claims directly through your profile with zero paperwork." },
                            { title: "Smart Savings", desc: "No claim bonus that actually rewards your healthy lifestyle tracked via our platform." }
                        ].map((item) => (
                            <div key={item.title} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                <h4 className="font-bold text-blue-400 mb-2">{item.title}</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {selectedPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setSelectedPlan(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            ✕
                        </button>
                        <h3 className="text-2xl font-bold mb-2">Complete Application</h3>
                        <p className="text-slate-400 mb-6 flex justify-between items-center">
                            <span>{selectedPlan.name}</span>
                            <span className="font-bold text-white flex items-center"><IndianRupee className="w-4 h-4 mr-1" />{selectedPlan.price}/mo</span>
                        </p>

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    value={formData.applicantName}
                                    onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Age</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max="120"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    value={formData.applicantAge}
                                    onChange={(e) => setFormData({ ...formData, applicantAge: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Address</label>
                                <textarea
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    value={formData.applicantAddress}
                                    onChange={(e) => setFormData({ ...formData, applicantAddress: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div className="pt-4 border-t border-white/10">
                                <label className="block text-sm font-medium text-slate-300 mb-3">Select Payment Method</label>
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.paymentMethod === 'card'
                                                ? 'bg-blue-500/20 border-blue-500 text-white'
                                                : 'bg-black/30 border-white/10 text-slate-400 hover:bg-black/50 hover:border-white/20'
                                            }`}
                                    >
                                        <CreditCard className="w-6 h-6" />
                                        <span className="text-xs font-medium">Card</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.paymentMethod === 'upi'
                                                ? 'bg-blue-500/20 border-blue-500 text-white'
                                                : 'bg-black/30 border-white/10 text-slate-400 hover:bg-black/50 hover:border-white/20'
                                            }`}
                                    >
                                        <Smartphone className="w-6 h-6" />
                                        <span className="text-xs font-medium">UPI / QR</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, paymentMethod: 'net_banking' })}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.paymentMethod === 'net_banking'
                                                ? 'bg-blue-500/20 border-blue-500 text-white'
                                                : 'bg-black/30 border-white/10 text-slate-400 hover:bg-black/50 hover:border-white/20'
                                            }`}
                                    >
                                        <Building2 className="w-6 h-6" />
                                        <span className="text-xs font-medium">Net Banking</span>
                                    </button>
                                </div>

                                {formData.paymentMethod === 'card' && (
                                    <div className="space-y-3 animate-fade-in bg-black/20 p-4 rounded-xl border border-white/5">
                                        <input
                                            type="text"
                                            placeholder="Card Number"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                            />
                                            <input
                                                type="password"
                                                placeholder="CVV"
                                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Name on Card"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                        />
                                    </div>
                                )}

                                {formData.paymentMethod === 'upi' && (
                                    <div className="space-y-4 animate-fade-in bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                                        <div className="bg-white p-4 rounded-xl inline-block mx-auto">
                                            <div className="w-32 h-32 bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg relative overflow-hidden group">
                                                <QrCode className="w-16 h-16 text-slate-400 group-hover:scale-110 transition-transform duration-300" />
                                                <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                                                    <span className="text-blue-600 font-bold text-sm">Scan to Pay</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-400">Scan QR Code with any UPI App<br />(GPay, PhonePe, Paytm)</p>
                                        <div className="relative flex items-center py-2">
                                            <div className="flex-grow border-t border-white/10"></div>
                                            <span className="flex-shrink-0 mx-4 text-xs text-slate-500 font-medium">OR</span>
                                            <div className="flex-grow border-t border-white/10"></div>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Enter UPI ID (e.g. name@okhdfcbank)"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                        />
                                    </div>
                                )}

                                {formData.paymentMethod === 'net_banking' && (
                                    <div className="animate-fade-in bg-black/20 p-4 rounded-xl border border-white/5">
                                        <select className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm appearance-none cursor-pointer">
                                            <option value="" disabled selected>Select your Bank</option>
                                            <option value="hdfc">HDFC Bank</option>
                                            <option value="sbi">State Bank of India</option>
                                            <option value="icici">ICICI Bank</option>
                                            <option value="axis">Axis Bank</option>
                                            <option value="kotak">Kotak Mahindra Bank</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={!!loading}
                                className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center mt-6"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <span className="flex items-center">Pay <IndianRupee className="w-4 h-4 mx-1" />{selectedPlan.price} & Apply</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
