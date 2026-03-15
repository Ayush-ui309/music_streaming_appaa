import React from 'react';
import { User, Music, Star, Zap, Heart, Disc } from 'lucide-react';

export const AVATAR_OPTIONS = [
  { type: 'icon', value: 'User', color: '#4df478', label: 'Default' },
  { type: 'icon', value: 'Star', color: '#ffcc00', label: 'Star' },
  { type: 'icon', value: 'Zap', color: '#ff4d4d', label: 'Bolt' },
  { type: 'icon', value: 'Music', color: '#4a9eff', label: 'Vinyl' },
  { type: 'initial', value: 'A', color: '#ff7043', label: 'Orange' },
  { type: 'initial', value: 'B', color: '#9c27b0', label: 'Purple' },
  { type: 'initial', value: 'C', color: '#00bcd4', label: 'Cyan' },
  { type: 'initial', value: 'D', color: '#8bc34a', label: 'Lime' },
];

const ICON_MAP = { User, Music, Star, Zap, Heart, Disc };

const UserAvatar = ({ avatar, size = 40, border = false, onClick }) => {
  console.log("[UserAvatar] avatar prop:", avatar);
  // avatar format: "type:value:color"
  let [type, value, color] = (avatar || 'icon:User:#4df478').split(':');

  // Handle legacy single-character format ('U', 'A', etc.)
  if (avatar && avatar.length === 1 && !avatar.includes(':')) {
    type = 'initial';
    value = avatar;
    color = '#4a9eff'; // Default blue color for legacy avatars
  }

  const containerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: color || 'var(--bg-surface-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: onClick ? 'pointer' : 'default',
    border: border ? '2px solid rgba(255,255,255,0.1)' : 'none',
    flexShrink: 0,
    transition: 'transform 0.2s',
  };

  const IconComponent = ICON_MAP[value] || User;

  return (
    <div 
      style={containerStyle} 
      onClick={onClick}
      onMouseEnter={(e) => onClick && (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => onClick && (e.currentTarget.style.transform = 'scale(1)')}
    >
      {type === 'initial' ? (
        <span style={{ fontSize: `${size * 0.5}px`, fontWeight: '800', color: '#fff' }}>
          {value}
        </span>
      ) : (
        <IconComponent size={size * 0.6} color="#000" />
      )}
    </div>
  );
};

export default UserAvatar;
