import React, {useContext, useEffect } from "react";
import { FaArrowLeft } from 'react-icons/fa'
import { view_Gallery_Context, view_individual_Flipbook_Context } from "../../context/NMcontext";
import { pdf_Context } from "../../context/NMcontext";

//importing pdf from public folder
import pdf_1 from "/newsletters/vol_1_issue_1.pdf"
import pdf_2 from "/newsletters/vol_1_issue_2.pdf"
import pdf_3 from "/newsletters/vol_1_issue_3.pdf"
import pdf_4 from "/newsletters/vol_1_issue_4.pdf"

const NGallery = () => {

    const view_Gallery_Value = useContext(view_Gallery_Context)
    const view_individual_Flipbook_Value = useContext(view_individual_Flipbook_Context)
    const pdf_Value = useContext(pdf_Context)


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    const open_Book = (pdfName) => {
        pdf_Value.setPdf(pdfName)
        view_individual_Flipbook_Value.setView_individual_Flipbook(true)
    }

    return (
        <>
            <main className='mx-1 sm:mx-10 mt-10 mb-5 text-[#0F2A5A]'>
                <div>
                    <FaArrowLeft onClick={() => { view_Gallery_Value.setView_Gallery(false) }} className='w-7 h-7 cursor-pointer transition-all transform hover:scale-120 duration-300 ease-in-out' />
                </div>
                <div className="textSection">
                    <h1 className='text-4xl font-bold text-center'>Alumni Newsletter Collection</h1>
                    <p className='mt-5 mx-auto text-center'>Browse through all editions of our alumni newsletter — featuring updates, events, and memorable highlights from the IIT Indore alumni community.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-5 xl:mx-25 mt-10">

                    <div onClick={() => open_Book(pdf_4)} className="bg-[#B9CDC0] m-2 p-5 w-fit rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg hover:shadow-black">
                        <h1 className="text-center font-bold text-3xl">POD Pulse</h1>
                        <h2 className="text-center font-bold italic text-xl">Volume 1, Issue 4</h2>
                        <p className="mx-auto text-center">A roundup of recent institute initiatives, student activities, and faculty achievements showcasing the dynamic progress of IIT Indore</p>
                    </div>

                    <div onClick={() => open_Book(pdf_3)} className="bg-[#B9CDC0] m-2 p-5 w-fit rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg hover:shadow-black">
                        <h1 className="text-center font-bold text-3xl">POD Pulse</h1>
                        <h2 className="text-center font-bold italic text-xl">Volume 1, Issue 3</h2>
                        <p className="mx-auto text-center">Discover the journey of IIT Indore, its unique interdisciplinary approach, and the diverse opportunities it offers to students and researchers</p>
                    </div>

                    <div onClick={() => open_Book(pdf_2)} className="bg-[#B9CDC0] m-2 p-5 w-fit rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg hover:shadow-black">
                        <h1 className="text-center font-bold text-3xl">POD Pulse</h1>
                        <h2 className="text-center font-bold italic text-xl">Volume 1, Issue 2</h2>
                        <p className="mx-auto text-center">An in-depth introduction to IIT Indore—its vision, legacy, infrastructure, and the academic culture that fosters innovation and excellence</p>
                    </div>

                    <div onClick={() => open_Book(pdf_1)} className="bg-[#B9CDC0] m-2 p-5 w-fit rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg hover:shadow-black">
                        <h1 className="text-center font-bold text-3xl">POD Pulse</h1>
                        <h2 className="text-center font-bold italic text-xl">Volume 1, Issue 1</h2>
                        <p className="mx-auto text-center">Highlights from key institute events, achievements, and milestones that reflect the vibrant academic and cultural life of IIT Indore</p>
                    </div>

                </div>
            </main>
        </>
    )
}

export default NGallery