import React from 'react'
import { useState } from 'react'

function Footer() {
    const [today, setToday]= useState(new Date().getFullYear());
    return (
        <>
            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p>&copy;{`${today}`} PropertyPro. All rights reserved.</p>
                </div>
            </footer>
        </>
    )
}

export default Footer