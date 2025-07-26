import React, { useContext, useEffect } from "react";
import { FaArrowLeft } from 'react-icons/fa'
import { view_Gallery_Context, view_individual_Flipbook_Context } from "../../context/NMcontext";
import { pdf_Context } from "../../context/NMcontext";

//importing pdf from public folder
import pdf_1 from "/magazines/magazine_16.pdf"
import pdf_2 from "/magazines/magazine_19.pdf"
import pdf_3 from "/magazines/magazine_23.pdf"
import pdf_4 from "/magazines/magazine_24.pdf"
import pdf_5 from "/magazines/magazine_25.pdf"

const MGallery = () => {

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
                    <h1 className='text-4xl font-bold font-inter text-center'>Alumni Magazine Collection</h1>
                    <p className='mt-5 mx-auto text-center'>Celebrate inspiring journeys, nostalgic memories, and standout achievements from our global alumni. Each edition brings you closer to the community—one page at a time.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-5 xl:mx-25 mt-10">

                    <div onClick={() => open_Book(pdf_5)} className="card bg-[#B9CDC0] m-2 p-5 w-fit rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg hover:shadow-black">
                        <h1 className="text-center font-bold text-3xl mb-2 italic">Magazine'25</h1>
                        <p className="mx-auto text-center">From academic excellence to cultural milestones, this magazine reflects the energy, dedication, and accomplishments that defined our collective experience during the session.</p>
                    </div>

                    <div onClick={() => open_Book(pdf_4)} className="card bg-[#B9CDC0] m-2 p-5 w-fit rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg hover:shadow-black">
                        <h1 className="text-center font-bold text-3xl mb-2 italic">Magazine'24</h1>
                        <p className="mx-auto text-center">An annual tribute to the passion, perseverance, and progress of our community, this edition unites voices, memories, and achievements in a single memorable publication.</p>
                    </div>

                    <div onClick={() => open_Book(pdf_3)} className="card bg-[#B9CDC0] m-2 p-5 w-fit rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg hover:shadow-black">
                        <h1 className="text-center font-bold text-3xl mb-2 italic">Magazine'23</h1>
                        <p className="mx-auto text-center">Blending stories of success, culture, and change, this magazine is a testament to the vibrant spirit and shared experiences that shaped our year together.</p>
                    </div>

                    <div onClick={() => open_Book(pdf_2)} className="card bg-[#B9CDC0] m-2 p-5 w-fit rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg hover:shadow-black">
                        <h1 className="text-center font-bold text-3xl mb-2 italic">Magazine'19</h1>
                        <p className="mx-auto text-center">More than just a collection of events, this magazine is a timeless snapshot of the dreams, efforts, and connections that made our year unforgettable.</p>
                    </div>

                    <div onClick={() => open_Book(pdf_1)} className="card bg-[#B9CDC0] m-2 p-5 w-fit rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg hover:shadow-black">
                        <h1 className="text-center font-bold text-3xl mb-2 italic">Magazine'16</h1>
                        <p className="mx-auto text-center">A curated collection of milestones, reflections, and creative expressions, this edition offers a glimpse into the dynamic experiences and growth of our batch throughout the year.</p>
                    </div>

                </div>
            </main>
        </>
    )
}

export default MGallery