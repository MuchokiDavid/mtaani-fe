import React from 'react'
import NavMenu from './components/NavMenu';
import Footer from './components/Footer';
import { FaHome, FaUsers, FaTools, FaComments, FaBell } from "react-icons/fa";
import Contact from './components/Contact';

function Home() {
    return (
        <>
            <NavMenu />
            {/* Hero Section */}
            <section className="bg-blue-600 text-white py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-6">
                        Simplify Property Management
                    </h1>
                    <p className="text-xl mb-8">
                        Manage your properties, tenants, and maintenance requests all in one
                        place. Join thousands of landlords and tenants using PropertyPro.
                    </p>
                    <div className="space-x-4">
                        <a
                            href="/register"
                            className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100"
                        >
                            Get Started
                        </a>
                        <a
                            href="#features"
                            className="bg-transparent border border-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-600"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <FaHome className="text-5xl text-blue-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Property Management</h3>
                            <p className="text-gray-600">
                                Easily manage all your properties and tenants in one place.
                            </p>
                        </div>
                        <div className="text-center">
                            <FaTools className="text-5xl text-blue-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Maintenance Requests</h3>
                            <p className="text-gray-600">
                                Streamline maintenance requests and repairs.
                            </p>
                        </div>
                        <div className="text-center">
                            <FaComments className="text-5xl text-blue-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Communication</h3>
                            <p className="text-gray-600">
                                Communicate seamlessly with tenants and landlords.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-16 bg-gray-100">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Testimonials</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <p className="text-gray-600 mb-4">
                                "PropertyPro has made managing my properties so much easier. The
                                maintenance request feature is a game-changer!"
                            </p>
                            <p className="font-semibold">- John Doe, Landlord</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <p className="text-gray-600 mb-4">
                                "As a tenant, I love how easy it is to communicate with my
                                landlord and report issues."
                            </p>
                            <p className="font-semibold">- Jane Smith, Tenant</p>
                        </div>
                    </div>
                </div>
            </section>

            <Contact/>

            {/* Call-to-Action Section */}
            <section className="bg-blue-600 text-white py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
                    <p className="text-xl mb-8">
                        Join thousands of landlords and tenants using PropertyPro to simplify
                        property management.
                    </p>
                    <a
                        href="/register"
                        className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100"
                    >
                        Sign Up Now
                    </a>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Home