import './Introtext.css'
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const BigQuote = () => {
    useGSAP(() => {
		// gsap code here...
		gsap.from('.introtext', 
      
      {
      opacity: 0,
      duration: 1.5,
      ease: 'none',

      }); 
	},);
  return (
    <div className='mainintrotext'>
      <div className='bro1'>“</div>
      
      <p className='introtext'>
       Builds strong ties between alumni and the institute through talks, reunions, and mentorship, helping students gain valuable guidance while preserving the institute’s legacy.
      </p>

      <div className='bro2'>”</div>

      
    </div>
  );
};

export default BigQuote;
