import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HorizontalSection = ({ title, children, onShowAll }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [children]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 500);
    }
  };

  return (
    <section style={styles.section} className="horizontal-section-wrapper">
      <div style={styles.header}>
        <h2 className="title-md" style={styles.title}>{title}</h2>
        {onShowAll && (
          <button style={styles.showAll} onClick={onShowAll}>
            Show all
          </button>
        )}
      </div>
      
      <div style={styles.containerRelative}>
        {canScrollLeft && (
          <button 
            style={{ ...styles.scrollBtn, left: '-20px' }} 
            onClick={() => scroll('left')}
            className="scroll-arrow"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        
        <div 
          className="horizontal-scroll-container" 
          ref={scrollRef}
          onScroll={checkScroll}
        >
          {children}
        </div>

        {canScrollRight && (
          <button 
            style={{ ...styles.scrollBtn, right: '-20px' }} 
            onClick={() => scroll('right')}
            className="scroll-arrow"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </section>
  );
};

const styles = {
  section: {
    marginBottom: '40px',
    width: '100%',
    position: 'relative',
    padding: '0 8px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '16px',
    padding: '0 8px',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    letterSpacing: '-0.5px',
  },
  showAll: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'all 0.2s',
  },
  containerRelative: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  scrollBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(50, 50, 50, 0.8)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
    transition: 'all 0.2s',
    backdropFilter: 'blur(8px)',
  }
};

export default HorizontalSection;
