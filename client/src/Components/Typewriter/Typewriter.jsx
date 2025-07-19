import React, { useState, useEffect } from 'react';
import './Typewriter.css';

const sentences = [
  'Alumni Cell',
  'IIT INDORE'
];

const Typewriter = () => {
 const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const constant = ' .'; 

  useEffect(() => {
    const currentSentence = sentences[sentenceIndex];

    let typingSpeed = isDeleting ? 50 : 100;

    const handleTyping = () => {
      if (!isDeleting) {
        if (charIndex < currentSentence.length) {
          setText(currentSentence.substring(0, charIndex + 1) + constant);
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 1000); 
        }
      } else {
        if (charIndex > 0) {
          setText(currentSentence.substring(0, charIndex - 1) + constant);
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setSentenceIndex((sentenceIndex + 1) % sentences.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, sentenceIndex]);

  return <div className="typewriter">{text}</div>;
};


export default Typewriter;
