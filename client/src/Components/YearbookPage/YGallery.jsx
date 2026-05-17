import React, { useContext, useEffect, useState } from "react";
import { FaArrowLeft } from 'react-icons/fa'
import { view_Gallery_Context, view_individual_Flipbook_Context } from "../../context/NMcontext";
import { pdf_Context } from "../../context/NMcontext";
import axios from "axios";
import { API_BASE_URL } from "../../api/alumni";

//importing pdf from public folder
// import pdf_1 from "/magazines/magazine_16.pdf"
// import pdf_2 from "/magazines/magazine_19.pdf"
// import pdf_3 from "/magazines/magazine_23.pdf"
// import pdf_4 from "/magazines/magazine_24.pdf"
// import pdf_5 from "/magazines/magazine_25.pdf"

const YGallery = () => {

    const view_Gallery_Value = useContext(view_Gallery_Context)
    const view_individual_Flipbook_Value = useContext(view_individual_Flipbook_Context)
    const pdf_Value = useContext(pdf_Context)

    const [yearbooks, setYearbooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchYearbooks = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/admin/get-Yearbooks`); 
                setYearbooks(res.data.data || []);
            } catch (err) {
                console.error("Error fetching yearbooks:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchYearbooks();
    }, []);


    const open_Book = (pdfUrl) => {
        pdf_Value.setPdf(pdfUrl)
        view_individual_Flipbook_Value.setView_individual_Flipbook(true)
    }

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen text-2xl text-[#173460]">
                Loading yearbooks...
            </div>
        );

    return (
        <>
            <main className="mx-1 sm:mx-10 mt-16 lg:mt-10 mb-5 text-[#0F2A5A]">
                <div>
                    <FaArrowLeft
                        onClick={() => {
                            view_Gallery_Value.setView_Gallery(false);
                        }}
                        className="text-[#173460] hover:text-[#19438b] w-7 h-7 cursor-pointer transition-all transform hover:scale-125 duration-300 ease-in-out"
                    />
                </div>

                <div className="textSection">
                    <h1 className="text-4xl font-bold text-center">Alumni Yearbook Collection</h1>
                    <p className="mt-5 mx-auto text-center">
                        Discover our collection of alumni yearbooks — featuring stories,
                        memories, achievements, and milestones from IIT Indore’s alumni.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-5 xl:mx-25 mt-10">
                    {yearbooks.length > 0 ? (
                        yearbooks
                            .slice()
                            // .reverse() similarly removed here also
                            .map((yb) => (
                                <div
                                    key={yb._id}
                                    onClick={() => open_Book(yb.pdfUrl)}
                                    className="bg-[#B9CDC0] m-2 p-5 w-fit rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg hover:shadow-black"
                                >
                                    <h1 className="text-center font-bold text-3xl">
                                        {yb.title || "Untitled Yearbook"}
                                    </h1>
                                    <p className="mx-auto text-center mt-2">
                                        Explore the memories and experiences from our alumni network.
                                    </p>
                                </div>
                            ))
                    ) : (
                        <p className="text-center text-lg mt-10">
                            No yearbooks available yet.
                        </p>
                    )}
                </div>
            </main>
        </>
    )
}

export default YGallery
