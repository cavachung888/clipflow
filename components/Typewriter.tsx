
import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  words: string[];
  className?: string;
}

const Typewriter: React.FC<TypewriterProps> = ({ words, className }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Reset when words change (e.g. language switch)
  useEffect(() => {
    setIndex(0);
    setSubIndex(0);
    setReverse(false);
  }, [words]);

  // Blinking cursor
  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  useEffect(() => {
    if (words.length === 0) return;

    // If index is out of bounds due to words change, don't do anything until reset
    if (index >= words.length) return;

    if (subIndex === words[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000); // Wait before deleting
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 50 : 100); // Type speed vs Delete speed

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  const currentWord = words[index] || "";

  return (
    <span className={className}>
      {currentWord.substring(0, subIndex)}
      <span className={`ml-1 inline-block w-1 h-[1em] bg-brand-600 align-middle ${blink ? 'opacity-100' : 'opacity-0'}`}>&nbsp;</span>
    </span>
  );
};

export default Typewriter;
