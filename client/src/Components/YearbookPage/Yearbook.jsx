import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../api/alumni";

const Yearbook = () => {
    const [yearbooks, setYearbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedYearbook, setSelectedYearbook] = useState(null);

    useEffect(() => {
        const fetchYearbooks = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/admin/get-yearbooks`);
                const YearbooksData = res.data.data || res.data;
                if (YearbooksData && YearbooksData.length > 0) {
                    const sorted = YearbooksData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setYearbooks(sorted);
                }
            } catch (err) {
                console.error("Error fetching Yearbooks:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchYearbooks();
    }, []);

    // Listen to ESC key to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setSelectedYearbook(null);
            }
        };
        if (selectedYearbook) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedYearbook]);

    if (loading) {
        return <div className="text-center py-10 text-lg font-semibold text-[#0F2A5A]">Loading Yearbooks...</div>;
    }
    if (!yearbooks || yearbooks.length === 0) {
        return <div className="text-center py-10 text-lg text-red-600 font-semibold">No Yearbooks available!</div>;
    }

    const effectiveOptions = selectedYearbook
        ? (selectedYearbook.options && selectedYearbook.options.length > 0
            ? selectedYearbook.options
            : (selectedYearbook.pdfUrl ? [{ _id: 'legacy', title: selectedYearbook.title, pdfUrl: selectedYearbook.pdfUrl, imageUrl: selectedYearbook.coverImage }] : []))
        : [];

    return (
        <>
            <main className='mx-1 sm:mx-3 lg:mx-10 mt-16 lg:mt-10 mb-5 text-[#0F2A5A]'>
                <div className="textSection text-center mb-8">
                    <h1 className='text-4xl font-bold font-inter text-[#0F2A5A]'>Discover Stories Inside Our Yearbooks</h1>
                    <p className='mt-4 text-lg text-gray-600 max-w-2xl mx-auto'>
                        Our annual alumni Yearbooks capture the spirit of our vibrant community—featuring inspiring journeys, professional milestones, campus nostalgia, and memorable moments. Each edition is a curated collection of voices and stories that celebrate the legacy we all share.
                    </p>
                </div>

                <div className="contentSection mx-0 sm:mx-3 lg:mx-10 mt-7">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {yearbooks.map((yearbook, index) => (
                            <div 
                                key={yearbook._id} 
                                className="yearbook-card bg-[#B9CDC0] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full cursor-pointer"
                                onClick={() => setSelectedYearbook(yearbook)}
                            >
                                <div className="flex flex-col items-center text-center flex-grow">
                                    <div className="inline-block p-4 bg-white rounded-full mb-4 shadow-sm">
                                        <svg className="w-8 h-8 text-[#0F2A5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    
                                    {index === 0 && (
                                        <span className="inline-block bg-[#173460] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                                            Latest Edition
                                        </span>
                                    )}
                                    
                                    <h3 className='font-bold text-xl text-[#0F2A5A] mb-2 line-clamp-2 min-h-[3.5rem] flex items-center justify-center'>
                                        {yearbook.title || "Untitled Yearbook"}
                                    </h3>
                                    
                                    <div className="flex gap-3 justify-center items-center mt-auto pt-4">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedYearbook(yearbook);
                                            }} 
                                            className="bg-[#173460] hover:bg-[#19438b] text-white text-sm font-semibold rounded-lg py-2 px-6 transition-all duration-300 hover:scale-105"
                                        >
                                            📖 View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Responsive Popup Modal */}
            {selectedYearbook && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300"
                    onClick={() => setSelectedYearbook(null)}
                >
                    <div 
                        className="bg-white text-[#0F2A5A] rounded-2xl w-[95%] max-w-2xl max-h-[85vh] overflow-y-auto p-5 sm:p-6 shadow-2xl relative border border-gray-100 transform transition-all duration-300 scale-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button 
                            onClick={() => setSelectedYearbook(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                            aria-label="Close"
                        >
                            ✕
                        </button>

                        <div className="text-center mb-6">
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2A5A]">
                                {selectedYearbook.title || "Yearbook"}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Select an edition below to view in a new tab
                            </p>
                        </div>

                        {/* Dynamic Options Grid */}
                        {effectiveOptions.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {effectiveOptions.map((opt, i) => (
                                    <div 
                                        key={opt._id || i}
                                        className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition duration-200"
                                    >
                                        <div>
                                            {opt.imageUrl ? (
                                                <img 
                                                    src={opt.imageUrl} 
                                                    alt={opt.title} 
                                                    className="w-full h-44 object-cover rounded-lg mb-3 shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-full h-44 bg-gradient-to-br from-[#173460] to-[#0F2A5A] rounded-lg flex flex-col items-center justify-center text-white p-4 shadow-sm mb-3">
                                                    <svg className="w-12 h-12 mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                    <span className="text-xs font-medium tracking-wide uppercase opacity-90">{selectedYearbook.title}</span>
                                                </div>
                                            )}

                                            <h3 className="font-bold text-lg text-center text-[#0F2A5A] mb-3">
                                                {opt.title}
                                            </h3>
                                        </div>

                                        <a 
                                            href={opt.pdfUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="w-full bg-[#173460] hover:bg-[#19438b] text-white text-center font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 block shadow-sm hover:scale-[1.02] text-sm"
                                        >
                                            📖 Open {opt.title}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-6">No links available for this yearbook.</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Yearbook;
