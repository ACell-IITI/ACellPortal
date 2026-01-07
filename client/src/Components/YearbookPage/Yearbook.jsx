import React, { useState, useRef, useEffect, useContext } from "react";
import { FaShareAlt } from 'react-icons/fa'
import axios from "axios";
import { view_Gallery_Context } from "../../context/NMcontext";
import { API_BASE_URL } from "../../api/alumni";

const FLIPBOOK_WIDTH = 430;
const FLIPBOOK_HEIGHT = 608;

const Yearbook = () => {

    const view_Gallery_Value = useContext(view_Gallery_Context)

    const [yearbooks, setYearbooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchYearbooks = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/admin/get-yearbooks`);
                const Yearbooks = res.data.data || res.data;
                if (Yearbooks && Yearbooks.length > 0) {
                    const sorted = Yearbooks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
    if (loading) {
        return <div className="text-center py-10 text-lg">Loading Yearbooks...</div>;
    }
    if (!yearbooks || yearbooks.length === 0) {
        return <div className="text-center py-10 text-lg text-red-600">No Yearbooks available!</div>;
    }

    return (
        <>
            <main className='mx-1 sm:mx-3 lg:mx-10 mt-16 lg:mt-10 mb-5 text-[#0F2A5A]'>
                <div className="textSection text-center mb-8">
                    <h1 className='text-4xl font-bold font-inter text-[#0F2A5A]'>Discover Stories Inside Our Yearbooks</h1>
                    <p className='mt-4 text-lg text-gray-600 max-w-2xl mx-auto'>Our annual alumni Yearbooks capture the spirit of our vibrant community—featuring inspiring journeys, professional milestones, campus nostalgia, and memorable moments. Each edition is a curated collection of voices and stories that celebrate the legacy we all share.</p>
                </div>
                <div className="contentSection mx-0 sm:mx-3 lg:mx-10 mt-7">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {yearbooks.map((yearbook, index) => (
                            <div key={yearbook._id} className="yearbook-card bg-[#B9CDC0] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
                                <div className="flex flex-col items-center text-center flex-grow">
                                    <div className="inline-block p-4 bg-white rounded-full mb-4">
                                        <svg className="w-8 h-8 text-[#0F2A5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    
                                    {index === 0 && (
                                        <span className="inline-block bg-[#173460] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                                            Latest Edition
                                        </span>
                                    )}
                                    
                                    <h3 className='font-bold text-xl text-[#0F2A5A] mb-2 line-clamp-2 min-h-[3.5rem] flex items-center justify-center'>{yearbook.title || "Untitled Yearbook"}</h3>
                                    
                                    {/* <p className='text-gray-600 text-sm mb-6 flex-grow flex items-center'>
                                        {new Date(yearbook.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p> */}
                                    
                                    <div className="flex gap-3 justify-center items-center mt-auto">
                                        <a href={yearbook.pdfUrl} target="_blank" rel="noopener noreferrer" className="bg-[#173460] hover:bg-[#19438b] text-white text-sm font-semibold rounded-lg py-2 px-6 transition-all duration-300 hover:scale-105">
                                            📖 View
                                        </a>
                                        {/* <a href={yearbook.pdfUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white hover:bg-gray-50 text-[#0F2A5A] rounded-full transition-all hover:scale-110 shadow-sm">
                                            <FaShareAlt className='w-4 h-4' />
                                        </a> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    )
}

export default Yearbook
