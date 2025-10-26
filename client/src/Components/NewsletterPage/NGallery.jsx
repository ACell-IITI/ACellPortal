import React, { useContext, useEffect, useState } from "react";
import { FaArrowLeft } from 'react-icons/fa'
import { view_Gallery_Context, view_individual_Flipbook_Context } from "../../context/NMcontext";
import { pdf_Context } from "../../context/NMcontext";
import axios from "axios";
import { API_BASE_URL } from "../../api/alumni";

//importing pdf from public folder
// import pdf_1 from "/newsletters/vol_1_issue_1.pdf"
// import pdf_2 from "/newsletters/vol_1_issue_2.pdf"
// import pdf_3 from "/newsletters/vol_1_issue_3.pdf"
// import pdf_4 from "/newsletters/vol_1_issue_4.pdf"

const NGallery = () => {

  const view_Gallery_Value = useContext(view_Gallery_Context)
  const view_individual_Flipbook_Value = useContext(view_individual_Flipbook_Context)
  const pdf_Value = useContext(pdf_Context)

  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchNewsletters = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/admin/get-newsletters`);
        setNewsletters(res.data.data || []);
      } catch (err) {
        console.error("Error fetching newsletters:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletters();
  }, []);


  const open_Book = (pdfUrl) => {
    pdf_Value.setPdf(pdfUrl)
    view_individual_Flipbook_Value.setView_individual_Flipbook(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl text-[#173460]">
        Loading newsletters...
      </div>
    );
  }

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
          <h1 className="text-4xl font-bold text-center">
            Alumni Newsletter Collection
          </h1>
          <p className="mt-5 mx-auto text-center">
            Browse through all editions of our alumni newsletter — featuring
            updates, events, and memorable highlights from the IIT Indore alumni
            community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-5 xl:mx-25 mt-10">
          {newsletters.length > 0 ? (
            newsletters
              .slice()
              // .reverse() removed so that the latest card appears at top
              .map((nl) => (
                <div
                  key={nl._id}
                  onClick={() => open_Book(nl.pdfUrl)}
                  className="bg-[#B9CDC0] m-2 p-5 w-fit rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg hover:shadow-black"
                >
                  <h1 className="text-center font-bold text-3xl">
                    {nl.title || "Untitled Newsletter"}
                  </h1>
                  <p className="mx-auto text-center mt-2">
                    Explore insights, updates, and achievements from our alumni
                    community.
                  </p>
                </div>
              ))
          ) : (
            <p className="text-center text-lg mt-10">
              No newsletters available yet.
            </p>
          )}
        </div>
      </main>
    </>
  );
};

export default NGallery
