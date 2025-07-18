import { React, useState } from 'react'
import { view_Gallery_Context, view_individual_Flipbook_Context, pdf_Context } from '../context/NMcontext'
import Magazine from '../Components/MagazinePage/Magazine'
import MGallery from '../Components/MagazinePage/MGallery'
import Flipbook from '../Components/FlipbookPage/Flipbook'

function MagazinePage() {
    const [view_Gallery, setView_Gallery] = useState(false)
  const [view_individual_Flipbook, setView_individual_Flipbook] = useState(false)
  const [pdf, setPdf] = useState(null)

  return (
    <>
      <pdf_Context.Provider value={{ pdf, setPdf }}>

        <view_Gallery_Context.Provider value={{ view_Gallery, setView_Gallery }}>
          <view_individual_Flipbook_Context.Provider value={{ view_individual_Flipbook, setView_individual_Flipbook }}>

            {view_Gallery ? (view_individual_Flipbook ? <Flipbook /> : <MGallery />) : <Magazine />}

          </view_individual_Flipbook_Context.Provider>
        </view_Gallery_Context.Provider >

      </pdf_Context.Provider>
    </>
  )
}
export default MagazinePage