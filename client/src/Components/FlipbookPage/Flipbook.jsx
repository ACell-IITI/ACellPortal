import React, { useState, useRef, useContext, useEffect } from "react";
import {
    FaArrowLeft,
    FaArrowCircleLeft,
    FaArrowCircleRight,
    FaDownload,
    FaExpand,
    FaShareAlt,
} from "react-icons/fa";
import { view_individual_Flipbook_Context } from "../../context/NMcontext";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";
import { pdf_Context } from "../../context/NMcontext";

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

const Flipbook = () => {
    const view_individual_Flipbook_Value = useContext(view_individual_Flipbook_Context);
    const { pdf } = useContext(pdf_Context);

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
        console.log(numPages);
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
                    url: pdf,
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
            <main className="mx-1 sm:mx-3 lg:mx-10 mt-16 lg:mt-10 mb-5 text-[#0F2A5A]">
                <div className="contentSection bg-[#B9CDC0] rounded-2xl mx-0 sm:mx-3 lg:mx-10  p-5 px-1 sm:px-1 lg:px-10 mt-7 overflow-hidden">
                    <div className="part1 flex justify-between lg:px-0 sm:px-5 px-2">
                        <div>
                            <FaArrowLeft
                                onClick={() => {
                                    view_individual_Flipbook_Value.setView_individual_Flipbook(
                                        false
                                    );
                                }}
                                className="text-[#173460] hover:text-[#19438b] w-7 h-7 cursor-pointer transition-all transform hover:scale-125 duration-300 ease-in-out"
                            />
                        </div>
                        <div className="flex justify-between gap-2 sm:gap-5 list-none mt-3">
                            <FaExpand
                                onClick={handleFullscreen}
                                className="text-[#173460] hover:text-[#19438b] w-5 h-5 cursor-pointer transition-all transform hover:scale-125 duration-300 ease-in-out"
                            />
                            <a href={pdf} download>
                                <FaDownload className="text-[#173460] hover:text-[#19438b] w-5 h-5 cursor-pointer transition-all transform hover:scale-125 duration-300 ease-in-out" />
                            </a>
                            <FaShareAlt onClick={handleShare} className="text-[#173460] hover:text-[#19438b] w-5 h-5 cursor-pointer transition-all transform hover:scale-125 duration-300 ease-in-out" />
                        </div>
                    </div>
                    <div ref={flipbookContainerRef} className="flipbook flex justify-between items-center lg:gap-5 mt-5">
                        <FaArrowCircleLeft
                            className="text-[#173460] hover:text-[#19438b] rounded-full  w-10 h-10 cursor-pointer transition-all transform hover:scale-110 duration-300 ease-in-out"
                            onClick={() =>
                                flipBookRef.current?.pageFlip().flipPrev()
                            }
                        />

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
                            className={`rounded bg-transparent transition-transform duration-300 mx-auto ${isFullscreen ? "scale-125" : (windowWidth < 500) ? (windowWidth < 400) ? "scale-50" : "scale-75" : "scale-100"
                                }`}
                        >
                            {Array.from(new Array(numPages), (_, i) => (
                                <Pages
                                    key={i}
                                    number={i + 1}
                                    width={FLIPBOOK_WIDTH}
                                    height={FLIPBOOK_HEIGHT}
                                >
                                    <Document
                                        file={pdf}
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

                        <FaArrowCircleRight
                            className="text-[#173460] hover:text-[#19438b] rounded-full w-10 h-10 cursor-pointer transition-all transform hover:scale-110 duration-300 ease-in-out"
                            onClick={() =>
                                flipBookRef.current?.pageFlip().flipNext()
                            }
                        />
                    </div>
                </div>
            </main >
        </>
    );
};

export default Flipbook;
