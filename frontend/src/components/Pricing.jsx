import React from 'react'

const Pricing = () => {
    return (
        <>
            <section className="py-20 px-4 text-center">
                <h2 className="text-3xl font-bold mb-6">Simple, Transparent Pricing</h2>
                <p className="text-lg mb-12">Choose the plan that works best for your restaurant.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {[{
                        title: "Basic",
                        price: "$9",
                        features: ["1 QR code", "Up to 50 menu items", "Basic analytics", "Email support"]
                    }, {
                        title: "Standard",
                        price: "$19",
                        featured: true,
                        features: ["5 QR codes", "Up to 150 menu items", "Advanced analytics", "Priority email support", "Custom branding"]
                    }, {
                        title: "Premium",
                        price: "$39",
                        features: ["Unlimited QR codes", "Unlimited menu items", "Advanced analytics", "24/7 phone support", "Custom branding", "Multiple locations"]
                    }].map((plan, index) => (
                        <div key={index} className={`p-6 rounded-xl shadow ${plan.featured ? 'border-2 border-black' : 'bg-white'}`}>
                            <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                            <p className="text-2xl font-bold mb-4">{plan.price}<span className="text-sm">/month</span></p>
                            <ul className="text-left space-y-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i}>✔️ {feature}</li>
                                ))}
                            </ul>
                            <button className={`mt-4 w-full px-6 py-2 rounded-lg ${plan.featured ? 'bg-black text-white' : 'bg-gray-900 text-white'}`}>Get Started</button>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

export default Pricing