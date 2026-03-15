import React from 'react';

const Skeleton = ({ width, height, borderRadius, style }) => {
  return (
    <div 
      className="skeleton-pulse"
      style={{
        width: width || '100%',
        height: height || '100%',
        borderRadius: borderRadius || '4px',
        backgroundColor: 'var(--bg-skeleton)',
        ...style
      }}
    />
  );
};

export const MusicCardSkeleton = () => (
  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <Skeleton height="150px" borderRadius="12px" />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Skeleton height="18px" width="80%" />
      <Skeleton height="14px" width="60%" />
    </div>
  </div>
);

export const HeroSkeleton = () => (
  <div style={{ height: '320px', borderRadius: '24px', overflow: 'hidden' }}>
    <Skeleton height="100%" />
  </div>
);

export default Skeleton;
