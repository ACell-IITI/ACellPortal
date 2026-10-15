
// export default Yearbook;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../api/alumni";

import yearbook2023 from "../../yearbook/yearbook 2023 cover.png";
import yearbook2024 from "../../yearbook/yearbook 2024 cover.png";
import yearbook2025 from "../../yearbook/yearbook 2025 cover.png";
import yearbook2026 from "../../yearbook/yearbook 2026 cover.png";
import yearbook2026PG from "../../yearbook/yearbook 2026 PG cover.png";

const Yearbook = () => {
    const [yearbooks, setYearbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedYearbook, setSelectedYearbook] = useState(null);

    const yearbookImages = {
        "2023": yearbook2023,
        "2024": yearbook2024,
        "2025": yearbook2025,
        "2026": yearbook2026,
    };

    // Fetch yearbook data from MongoDB through backend
    useEffect(() => {
        const fetchYearbooks = async () => {
            try {
                const res = await axios.get(
                    `${API_BASE_URL}/api/admin/get-yearbooks`
                );
                const yearbooksData = res.data.data || res.data;
                if (yearbooksData && yearbooksData.length > 0) {
                    const sorted = [...yearbooksData].sort(
                        (a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                    );
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

    // Close modal using Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setSelectedYearbook(null);
            }
        };
        if (selectedYearbook) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedYearbook]);

    // Loading state
    if (loading) {
        return (
            <div className="text-center py-10 text-lg font-semibold text-[#0F2A5A]">
                Loading Yearbooks...
            </div>
        );
    }

    // Empty state
    if (!yearbooks || yearbooks.length === 0) {
        return (
            <div className="text-center py-10 text-lg text-red-600 font-semibold">
                No Yearbooks available!
            </div>
        );
    }

    // Options for selected yearbook
    // Only PDF/title data comes from MongoDB
    const effectiveOptions = selectedYearbook
        ? selectedYearbook.options &&
          selectedYearbook.options.length > 0
            ? selectedYearbook.options
            : selectedYearbook.pdfUrl
            ? [
                  {
                      _id: "legacy",
                      title: selectedYearbook.title,
                      pdfUrl: selectedYearbook.pdfUrl,
                      imageUrl: selectedYearbook.coverImage,
                  },
              ]
            : []
        : [];

    const selectedYear =
        selectedYearbook?.title?.match(/\d{4}/)?.[0];
    const selectedCoverImage =
        selectedYear === "2026" ? null : yearbookImages[selectedYear];

    return (
        <>
            {/* ================= MAIN PAGE ================= */}
            <main className="px-3 sm:px-5 lg:px-8 mt-14 sm:mt-16 lg:mt-8 mb-8 text-[#0F2A5A]">
                {/* Heading */}
                <div className="text-center mb-6 sm:mb-7">
                    <h1
                        className="
                            text-2xl
                            sm:text-3xl
                            lg:text-[2.5rem]
                            font-bold
                            leading-tight
                            font-inter
                            text-[#0F2A5A]
                        "
                    >
                        Discover Stories Inside Our Yearbooks
                    </h1>
                    <p
                        className="
                            mt-3
                            sm:mt-4
                            text-[13px]
                            sm:text-sm
                            lg:text-base
                            text-gray-600
                            max-w-2xl
                            mx-auto
                            leading-relaxed
                        "
                    >
                        Our annual alumni Yearbooks capture the spirit of our
                        vibrant community—featuring inspiring journeys,
                        professional milestones, campus nostalgia, and
                        memorable moments.
                    </p>
                </div>
                {/* ================= YEARBOOK GRID ================= */}
                <div className="mt-5 sm:mt-7">
                    <div
                        className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            lg:grid-cols-3
                            gap-4
                            sm:gap-5
                            max-w-5xl
                            mx-auto
                        "
                    >
                        {yearbooks.map((yearbook, index) => {
                            const year =
                                yearbook.title?.match(/\d{4}/)?.[0];
                            const coverImage = yearbookImages[year];
                            return (
                                <div
                                    key={yearbook._id}
                                    onClick={() =>
                                        setSelectedYearbook(yearbook)
                                    }
                                    className="
                                        group
                                        relative
                                        w-full
                                        max-w-[290px]
                                        lg:max-w-[310px]
                                        mx-auto
                                        h-[180px]
                                        sm:h-[205px]
                                        lg:h-[220px]
                                        overflow-hidden
                                        rounded-2xl
                                        cursor-pointer
                                        shadow-md
                                        hover:shadow-xl
                                        active:scale-[0.98]
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        bg-[#173460]
                                    "
                                >
                                    {/* Local Cover Image */}
                                    {coverImage && (
                                        <img
                                            src={coverImage}
                                            alt={
                                                yearbook.title ||
                                                "Yearbook cover"
                                            }
                                            className="
                                                absolute
                                                inset-0
                                                w-full
                                                h-full
                                                object-cover
                                                object-center
                                                transition-transform
                                                duration-500
                                                group-hover:scale-105
                                            "
                                        />
                                    )}
                                    {/* Overlay */}
                                    <div
                                        className="
                                            absolute
                                            inset-0
                                            bg-gradient-to-t
                                            from-[#071a38]/90
                                            via-[#071a38]/35
                                            to-transparent
                                        "
                                    />
                                    {/* Card Content */}
                                    <div
                                        className="
                                            relative
                                            z-10
                                            h-full
                                            flex
                                            flex-col
                                            justify-end
                                            p-4
                                            sm:p-5
                                        "
                                    >
                                        {/* Latest Edition */}
                                        {year === "2026" && (
                                            <span
                                                className="
                                                    self-start
                                                    bg-[#173460]/90
                                                    border
                                                    border-white/20
                                                    text-white
                                                    text-[10px]
                                                    sm:text-xs
                                                    font-semibold
                                                    px-2.5
                                                    py-1
                                                    rounded-full
                                                    mb-2
                                                    backdrop-blur-sm
                                                "
                                            >
                                                ☆ Latest Edition
                                            </span>
                                        )}
                                        {/* Title */}
                                        <h3
                                            className="
                                                text-white
                                                font-bold
                                                text-lg
                                                sm:text-xl
                                                leading-tight
                                                drop-shadow-md
                                            "
                                        >
                                            {yearbook.title ||
                                                "Untitled Yearbook"}
                                        </h3>
                                        {/* View Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedYearbook(
                                                    yearbook
                                                );
                                            }}
                                            className="
                                                mt-3
                                                self-start
                                                bg-blue-50
                                                text-[#173460]
                                                text-xs
                                                sm:text-sm
                                                font-semibold
                                                px-4
                                                py-2
                                                rounded-lg
                                                min-h-[40px]
                                                transition-all
                                                duration-200
                                                hover:bg-gray-100
                                                active:scale-95
                                            "
                                        >
                                            📖 View
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>

            {/* ================= MODAL ================= */}
            {selectedYearbook && (
                <div
                    className="
                        fixed
                        inset-0
                        bg-black/60
                        backdrop-blur-sm
                        z-50
                        flex
                        items-center
                        justify-center
                        p-2
                        sm:p-4
                    "
                    onClick={() => setSelectedYearbook(null)}
                >
                    <div
                        className="
                            bg-white
                            text-[#0F2A5A]
                            rounded-2xl
                            w-full
                            max-w-lg
                            max-h-[90dvh]
                            overflow-y-auto
                            p-3
                            sm:p-5
                            shadow-2xl
                            relative
                            border
                            border-gray-100
                        "
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedYearbook(null)}
                            className="
                                absolute
                                top-3
                                right-3
                                sm:top-4
                                sm:right-4
                                text-gray-400
                                hover:text-gray-700
                                text-xl
                                sm:text-2xl
                                font-bold
                                w-9
                                h-9
                                flex
                                items-center
                                justify-center
                                rounded-full
                                hover:bg-gray-100
                                transition
                            "
                            aria-label="Close"
                        >
                            ✕
                        </button>
                        {/* Modal Heading */}
                        <div className="text-center mb-4 sm:mb-5 pr-8">
                            <h2
                                className="
                                    text-lg
                                    sm:text-2xl
                                    font-bold
                                    text-[#0F2A5A]
                                "
                            >
                                {selectedYearbook.title || "Yearbook"}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                Select an edition below to view
                            </p>
                        </div>
                        {/* Local Cover Image */}
                        {selectedCoverImage && (
                            <div className="flex justify-center mb-5">
                                <img
                                    src={selectedCoverImage}
                                    alt={selectedYearbook.title}
                                    className="
                                        w-full
                                        max-w-[200px]
                                        h-[240px]
                                        sm:max-w-[220px]
                                        sm:h-[280px]
                                        object-cover
                                        object-center
                                        rounded-xl
                                        shadow-md
                                    "
                                />
                            </div>
                        )}
                        {/* PDF Options */}
                        {effectiveOptions.length > 0 ? (
                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    sm:grid-cols-2
                                    gap-3
                                    sm:gap-4
                                "
                            >
                                {effectiveOptions.map((opt, i) => {
                                    const optionGroup =
                                        opt.title?.toLowerCase().includes("pg")
                                            ? "PG"
                                            : opt.title?.toLowerCase().includes("ug")
                                              ? "UG"
                                              : i === 0
                                                ? "PG"
                                                : "UG";
                                    const optionTitle =
                                        selectedYear === "2026"
                                            ? `${optionGroup} Yearbook 2026`
                                            : opt.title;
                                    const optionCoverImage =
                                        selectedYear === "2026"
                                            ? optionGroup === "PG"
                                                ? yearbook2026PG
                                                : yearbook2026
                                            : null;

                                    return (
                                        <div
                                            key={opt._id || i}
                                            className="
                                                bg-gray-50
                                                border
                                                border-gray-200
                                                rounded-xl
                                                p-3
                                                sm:p-4
                                            "
                                        >
                                            {optionCoverImage && (
                                                <img
                                                    src={optionCoverImage}
                                                    alt={optionTitle}
                                                    className="
                                                        w-full
                                                        h-40
                                                        sm:h-48
                                                        lg:h-52
                                                        object-contain
                                                        bg-white
                                                        object-center
                                                        rounded-lg
                                                        shadow-sm
                                                        mb-3
                                                    "
                                                />
                                            )}
                                            <h3
                                                className="
                                                    font-bold
                                                    text-base
                                                    sm:text-lg
                                                    text-center
                                                    text-[#0F2A5A]
                                                    mb-3
                                                "
                                            >
                                                {optionTitle}
                                            </h3>
                                            <a
                                                href={opt.pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="
                                                    w-full
                                                    bg-[#173460]
                                                    hover:bg-[#19438b]
                                                    text-white
                                                    text-center
                                                    font-semibold
                                                    py-2.5
                                                    px-4
                                                    rounded-lg
                                                    transition-all
                                                    duration-200
                                                    block
                                                    text-sm
                                                "
                                            >
                                                📖 Open {optionTitle}
                                            </a>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-6">
                                No links available for this yearbook.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
export default Yearbook;
