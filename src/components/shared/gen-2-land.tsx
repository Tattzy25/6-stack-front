interface Gen2LandProps {
  onClick?: () => void;
  disabled?: boolean;
}

export function Gen2Land({ onClick, disabled = false }: Gen2LandProps) {
  return (
    <>
      <style>{`
        .gradient-button {
          position: relative;
          padding: 26px 42px;
          font-size: 36px;
          font-weight: bold;
          color: white;
          background: transparent;
          border: none;
          cursor: pointer;
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.2s ease;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.8);
        }

        .gradient-button:hover {
          transform: scale(1.03);
        }

        .gradient-button::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(
            from 0deg,
            #ff6b6b,
            #4ecdc4,
            #45b7d1,
            #96ceb4,
            #feca57,
            #ff9ff3,
            #ff6b6b
          );
          z-index: -2;
          filter: blur(10px);
          transform: rotate(0deg);
          transition: transform 1.5s ease-in-out;
        }

        .gradient-button:hover::before {
          transform: rotate(180deg);
        }

        .gradient-button::after {
          content: "";
          position: absolute;
          inset: 3px;
          background: black;
          border-radius: 40px;
          z-index: -1;
          filter: blur(5px);
        }

        .gradient-text {
          color: transparent;
          background: conic-gradient(
            from 0deg,
            #ff6b6b,
            #4ecdc4,
            #45b7d1,
            #96ceb4,
            #feca57,
            #ff9ff3,
            #ff6b6b
          );
          background-clip: text;
          -webkit-background-clip: text;
          filter: hue-rotate(0deg);
        }

        .gradient-button:hover .gradient-text {
          animation: hue-rotating 2s linear infinite;
        }

        .gradient-button:active {
          transform: scale(0.99);
        }

        @keyframes hue-rotating {
          to {
            filter: hue-rotate(360deg);
          }
        }
      `}</style>
      <button className="gradient-button text-[32px]" onClick={onClick} disabled={disabled}>
        <span className="gradient-text font-[Rock_Salt]">TaTT Now</span>
      </button>
    </>
  );
}
