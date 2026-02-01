import React from 'react';

export const StardustButton = ({
  children = "Launching Soon",
  onClick,
  className = "",
  variant = "orange", // 'orange' | 'dark'
  ...props
}) => {
  const palettes = {
    // Primary Action (Orange/Gold Glow) - For "Buy Books"
    orange: {
      white: '#fff7ed', // light orange
      bg: '#1a0b00', // very dark brown/orange
      base: '249, 115, 22', // orange-500
      accent: '234, 88, 12', // orange-600
    },
    // Secondary Action (Blue/Cool Glow) - For "Sell Books" or Standard Pearl
    dark: {
      white: '#e6f3ff', // light blue
      bg: '#0a1929', // dark blue
      base: '129, 216, 255', // cyan
      accent: '56, 189, 248', // sky-400
    }
  };

  const p = palettes[variant] || palettes.orange;

  const buttonStyle = {
    '--white': p.white,
    '--bg': p.bg,
    '--radius': '100px',
    outline: 'none',
    cursor: 'pointer',
    border: 0,
    position: 'relative',
    borderRadius: 'var(--radius)',
    backgroundColor: 'var(--bg)',
    transition: 'all 0.2s ease',
    boxShadow: `
      inset 0 0.3rem 0.9rem rgba(${p.base}, 0.3),
      inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.7),
      inset 0 -0.4rem 0.9rem rgba(${p.base}, 0.5),
      0 3rem 3rem rgba(0, 0, 0, 0.3),
      0 1rem 1rem -0.6rem rgba(0, 0, 0, 0.8)
    `,
  };

  const wrapStyle = {
    fontSize: '16px', // Adjusted size for app
    fontWeight: 500,
    color: `rgba(${p.base}, 0.9)`, // Text Color
    padding: '16px 36px',
    borderRadius: 'inherit',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const pStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: 0,
    transition: 'all 0.2s ease',
    transform: 'translateY(2%)',
    maskImage: `linear-gradient(to bottom, rgba(${p.base}, 1) 40%, transparent)`,
    zIndex: 2,
    position: 'relative'
  };

  const beforeAfterStyles = `
    .stardust-btn-${variant} .wrap::before,
    .stardust-btn-${variant} .wrap::after {
      content: "";
      position: absolute;
      transition: all 0.3s ease;
    }
    
    .stardust-btn-${variant} .wrap::before {
      left: -15%;
      right: -15%;
      bottom: 25%;
      top: -100%;
      border-radius: 50%;
      background-color: rgba(${p.accent}, 0.15);
    }
    
    .stardust-btn-${variant} .wrap::after {
      left: 6%;
      right: 6%;
      top: 12%;
      bottom: 40%;
      border-radius: 22px 22px 0 0;
      box-shadow: inset 0 10px 8px -10px rgba(${p.base}, 0.6);
      background: linear-gradient(
        180deg,
        rgba(${p.accent}, 0.25) 0%,
        rgba(0, 0, 0, 0) 50%,
        rgba(0, 0, 0, 0) 100%
      );
    }
    
    .stardust-btn-${variant} .wrap p span:nth-child(2) {
      display: none;
    }
    
    .stardust-btn-${variant}:hover .wrap p span:nth-child(1) {
      display: none;
    }
    
    .stardust-btn-${variant}:hover .wrap p span:nth-child(2) {
      display: inline-block;
    }
    
    .stardust-btn-${variant}:hover {
      box-shadow:
        inset 0 0.3rem 0.5rem rgba(${p.base}, 0.4),
        inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.7),
        inset 0 -0.4rem 0.9rem rgba(${p.accent}, 0.6),
        0 3rem 3rem rgba(0, 0, 0, 0.3),
        0 1rem 1rem -0.6rem rgba(0, 0, 0, 0.8);
    }
    
    .stardust-btn-${variant}:hover .wrap::before {
      transform: translateY(-5%);
    }
    
    .stardust-btn-${variant}:hover .wrap::after {
      opacity: 0.4;
      transform: translateY(5%);
    }
    
    .stardust-btn-${variant}:hover .wrap p {
      transform: translateY(-4%);
    }
    
    .stardust-btn-${variant}:active {
      transform: translateY(4px);
      box-shadow:
        inset 0 0.3rem 0.5rem rgba(${p.base}, 0.5),
        inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.8),
        inset 0 -0.4rem 0.9rem rgba(${p.accent}, 0.4),
        0 3rem 3rem rgba(0, 0, 0, 0.3),
        0 1rem 1rem -0.6rem rgba(0, 0, 0, 0.8);
    }
  `;

  return (
    <>
      <style>{beforeAfterStyles}</style>
      <button
        className={`stardust-btn-${variant} ${className}`}
        style={buttonStyle}
        onClick={onClick}
        {...props}
      >
        <div className="wrap" style={wrapStyle}>
          <p style={pStyle}>
            <span>✧</span>
            <span>✦</span>
            {children}
          </p>
        </div>
      </button>
    </>
  );
};
