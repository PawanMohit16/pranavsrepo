import React from 'react';

const WindowFrame = ({ 
  titleBarText, 
  children, 
  isActive = false, 
  onClick, 
  onClose, 
  className = "",
  repoUrl = null,
  style = {}
}) => {
  return (
    <div 
      onClick={onClick}
      style={style}
      className={`retro-window w-full border-3 border-black bg-white transition-all duration-75 cursor-default relative ${
        isActive ? 'active-window retro-shadow' : 'retro-shadow-sm'
      } ${className}`}
    >
      {/* Upper Grey/Black Title Bar */}
      <div 
        className={`window-title-bar px-3 py-2 flex items-center justify-between border-b-3 border-black select-none ${
          isActive ? 'bg-black text-white' : 'bg-retro-light text-retro-black'
        }`}
      >
        <div className="flex gap-1.5 items-center">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (onClose) onClose();
            }}
            className="win-close-btn w-3.5 h-3.5 border-2 border-black bg-white hover:bg-black transition-colors rounded-sm cursor-pointer"
            aria-label="Close Window"
          ></button>
          
          <button 
            className="w-3.5 h-3.5 border-2 border-black bg-white rounded-sm"
            aria-label="Minimize Window"
          ></button>
        </div>
        
        <span className="font-mono text-xs font-bold tracking-tight">{titleBarText}</span>
        
        <div className="w-7"></div>
      </div>
      
      {/* Content Area */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Render children contents */}
          {children}
          
          {/* View Repository button at the bottom of the card content if repoUrl is provided */}
          {repoUrl && (
            <div className="pt-2 text-left">
              <a 
                href={`https://github.com/${repoUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="retro-btn text-xs font-bold inline-block"
              >
                VIEW_REPOSITORY.EXE
              </a>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default WindowFrame;
