import React, { useState, useRef, useEffect, useContext } from "react";
import { FaArrowCircleLeft, FaArrowCircleRight, FaDownload, FaExpand, FaShareAlt } from 'react-icons/fa'
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";
const pdfFile = "/magazines/magazine_25.pdf";
import { view_Gallery_Context } from "../../context/NMcontext";

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
            <p className="text-sm mt-1">Page {number}</p>
        </div>
    );
});

Pages.displayName = "Pages";

const Magazine = () => {

    const view_Gallery_Value = useContext(view_Gallery_Context)

    const [numPages, setNumPages] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false)

    const flipBookRef = useRef(null);
    const flipbookContainerRef = useRef(null);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
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
                    url: pdfFile,
                }
            )
                .then(() => console.log('Shared successfully'))
                .catch((error) => console.error('Sharing failed:', error));
        } else {
            alert('Web Share is not supported on this browser.');
        }
    }

    return (
        <>
            <main className='mx-1 sm:mx-10 mt-10 mb-5 text-[#0F2A5A]'>
                <div className="textSection">
                    <h1 className='text-3xl font-bold font-inter'>Discover Stories Inside Our MAGAZINE</h1>
                    <p className='mt-2'>Our annual alumni magazine captures the spirit of our vibrant community—featuring inspiring journeys, professional milestones, campus nostalgia, and memorable moments. Each edition is a curated collection of voices and stories that celebrate the legacy we all share.</p>
                </div>
                <div className="contentSection bg-[#B9CDC0] rounded-2xl mx-0 sm:mx-10  p-5 px-1 sm:px-1 lg:px-10 mt-7 overflow-hidden">
                    <div className='part1 flex justify-between'>
                        <h1 className='font-bold text-3xl italic'>Magazine '25</h1>
                        <div className='flex justify-between gap-2 sm:gap-5 list-none mt-3'>
                            <FaExpand onClick={handleFullscreen} className='w-5 h-5 cursor-pointer transition-all transform hover:scale-120 duration-300 ease-in-out' />
                            <a href={pdfFile} download>
                                <FaDownload className="w-5 h-5 text-[#0F2A5A] cursor-pointer transition-all transform hover:scale-120 duration-300 ease-in-out" />
                            </a>
                            <FaShareAlt onClick={handleShare} className='w-5 h-5 cursor-pointer transition-all transform hover:scale-120 duration-300 ease-in-out' />
                        </div>
                    </div>
                    <div ref={flipbookContainerRef} className="flipbook flex justify-between items-center lg:gap-5 mt-5">
                        <FaArrowCircleLeft className='hover:shadow-[0_0_10px_4px_rgba(120,120,120,0.5)] rounded-full  w-10 h-10 cursor-pointer transition-all transform hover:scale-110 duration-300 ease-in-out' onClick={() => flipBookRef.current?.pageFlip().flipPrev()} />

                        <HTMLFlipBook
                            ref={flipBookRef}
                            showCover={true}
                            width={FLIPBOOK_WIDTH}
                            height={FLIPBOOK_HEIGHT}
                            size="stretch"
                            minWidth={FLIPBOOK_WIDTH}
                            maxWidth={FLIPBOOK_WIDTH}
                            minHeight={FLIPBOOK_HEIGHT}
                            maxHeight={FLIPBOOK_HEIGHT}
                            drawShadow={true}
                            useMouseEvents={true}
                            className={`rounded bg-transparent transition-transform duration-300 mx-auto ${isFullscreen ? "scale-150" : (window.innerWidth < 500) ? (window.innerWidth < 400) ? "scale-50" : "scale-75" : "scale-100"
                                }`}
                        >
                            {Array.from(new Array(numPages), (_, i) => (
                                <Pages key={i} number={i + 1} width={FLIPBOOK_WIDTH} height={FLIPBOOK_HEIGHT}>
                                    <Document
                                        file={pdfFile}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        loading={<div className="text-white">Loading...</div>}
                                    >
                                        <Page
                                            pageNumber={i + 1}
                                            width={FLIPBOOK_WIDTH}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                        />
                                    </Document>
                                </Pages>
                            ))}
                        </HTMLFlipBook>

                        <FaArrowCircleRight className='hover:shadow-[0_0_10px_4px_rgba(120,120,120,0.5)] rounded-full w-10 h-10 cursor-pointer transition-all transform hover:scale-110 duration-300 ease-in-out' onClick={() => flipBookRef.current?.pageFlip().flipNext()} />
                    </div>
                    <p onClick={() => { view_Gallery_Value.setView_Gallery(true) }} className='underline w-fit mt-5 mx-auto cursor-pointer transition-all transform hover:scale-105 duration-300 ease-in-out'>View All Magazines</p>

                </div>
            </main>
        </>
    )
}

export default Magazine