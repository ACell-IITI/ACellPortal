import React, { useState, useRef, useEffect, useContext } from "react";
import { FaArrowCircleLeft, FaArrowCircleRight, FaDownload, FaExpand, FaShareAlt } from 'react-icons/fa'
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";
import { view_Gallery_Context } from "../../context/NMcontext";
import { API_BASE_URL } from "../../api/alumni";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const FLIPBOOK_WIDTH = 430;
const FLIPBOOK_HEIGHT = 608;

const Pages = React.forwardRef(({ children, number }, ref) => {
    return (
        <div
            className="demoPage bg-white"
            ref={ref}
            style={{
                width: `${FLIPBOOK_WIDTH}px`,
                height: `${FLIPBOOK_HEIGHT}px`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                margin: 0,
                padding: 0,
            }}
        >
            {children}
        </div>
    );
});

Pages.displayName = "Pages";

const Reports = () => {

    const view_Gallery_Value = useContext(view_Gallery_Context)

    const [numPages, setNumPages] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [latestReport, setLatestReport] = useState(null);
    const [loading, setLoading] = useState(true);

    const flipBookRef = useRef(null);
    const flipbookContainerRef = useRef(null);

    useEffect(() => {
    const fetchLatestNewsletter = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/get-annual-reports`);
            //log 1
            // console.log("API response data : ", res.data.data);

            const reports = res.data.data || res.data;

if (reports && reports.length > 0) {
    const sorted = reports.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setLatestReport(sorted[0]);
}
        } catch (err) {
            console.error("Error fetching newsletters:", err);
        } finally {
            setLoading(false);
        }
    };
    fetchLatestNewsletter();
}, []);

// console.log("current state of Latest Newsletter: ", latestNewsletter); //log 2

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    // here is window.innerwidth part 
        const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
        useEffect(() => {
            const handleResize = () => setWindowWidth(window.innerWidth);
            window.addEventListener("resize", handleResize);
    
            handleResize();
    
            return () => window.removeEventListener("resize", handleResize);
        }, []);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        console.log(numPages)
    };

    const handleFullscreen = () => {
        const container = flipbookContainerRef.current;

        if (container?.requestFullscreen) {
            container.requestFullscreen();
        } else if (container?.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container?.msRequestFullscreen) {
            container.msRequestFullscreen();
        } else {
            alert("Fullscreen API is not supported.");
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share(
                {
                    title: "Alumni Magazine",
                    url: latestReport?.driveLink,
                }
            )
                .then(() => console.log('Shared successfully'))
                .catch((error) => console.error('Sharing failed:', error));
        } else {
            alert('Web Share is not supported on this browser.');
        }
    }

    if (loading) {
        return <div className="text-center py-10 text-lg">Loading annual reports...</div>;
    }

    if (!latestReport) {
        return <div className="text-center py-10 text-lg text-red-600">No annual reports available!</div>;
    }

    const reportLink = latestReport.driveLink;

    return (
    <main className="mx-1 sm:mx-3 lg:mx-10 mt-16 lg:mt-10 mb-5 text-[#0F2A5A]">
        <div className="textSection">
            <h1 className="text-3xl font-bold font-inter">
                Annual Reports
            </h1>

            <p className="mt-2">
                Our annual reports provide an overview of the Alumni Cell's
                activities, achievements and milestones.
            </p>
        </div>

        <div className="contentSection bg-[#B9CDC0] rounded-2xl mx-0 sm:mx-3 lg:mx-10 p-5 mt-7">
            <div className="flex flex-col items-center gap-5">
                
                {latestReport?.imageUrl && (
                    <img
                        src={latestReport.imageUrl}
                        alt={latestReport.title}
                        className="w-64 h-80 object-cover rounded-lg shadow-md"
                    />
                )}

                <h2 className="text-2xl font-bold text-center">
                    {latestReport.title || "Annual Report"}
                </h2>

                <a
                    href={latestReport.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#173460] hover:bg-[#19438b] text-white font-bold rounded-lg py-3 px-5 transition-all"
                >
                    View Annual Report
                </a>

                <button
                    className="bg-[#173460] hover:bg-[#19438b] text-white text-lg font-bold rounded-lg py-3 px-4 transition-all"
                    onClick={() => view_Gallery_Value.setView_Gallery(true)}
                >
                    View All Editions
                </button>
            </div>
        </div>
    </main>
);
}

export default Reports
