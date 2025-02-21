import React from 'react'

function NavMenu() {
    return (
        <>
            <nav className="bg-white shadow-lg">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        <div className="text-2xl font-bold text-blue-600">
                            PropertyPro
                        </div>
                        <div className="flex space-x-6">
                            <a href="#features" className="text-gray-700 hover:text-blue-600">
                                Features
                            </a>
                            <a href="#testimonials" className="text-gray-700 hover:text-blue-600">
                                Testimonials
                            </a>
                            <a href="#contact" className="text-gray-700 hover:text-blue-600">
                                Contact
                            </a>
                            <a
                                href="/login"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Login
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default NavMenu