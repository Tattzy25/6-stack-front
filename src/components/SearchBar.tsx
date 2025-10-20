import { Search } from 'lucide-react';

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value = '', onChange, placeholder = 'Search...' }: SearchBarProps = {}) {
  return (
    <>
      <style>{`
        @keyframes rotate-gradient {
          100% {
            transform: translate(-50%, -50%) rotate(450deg);
          }
        }

        .search-container {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .search-white,
        .search-border,
        .search-dark-border-bg,
        .search-glow {
          max-height: 70px;
          max-width: 314px;
          height: 100%;
          width: 100%;
          position: absolute;
          overflow: hidden;
          z-index: -1;
          border-radius: 12px;
          filter: blur(3px);
        }

        .search-input {
          background-color: #0C0C0D;
          border: none;
          width: 301px;
          height: 56px;
          border-radius: 10px;
          color: white;
          padding-inline: 59px;
          font-size: 18px;
        }

        .search-input::placeholder {
          color: #9ca3af;
        }

        .search-input:focus {
          outline: none;
        }

        .search-main:focus-within > .search-input-mask {
          display: none;
        }

        .search-input-mask {
          pointer-events: none;
          width: 100px;
          height: 20px;
          position: absolute;
          background: linear-gradient(90deg, transparent, #0C0C0D);
          top: 18px;
          left: 70px;
        }

        .search-pink-mask {
          pointer-events: none;
          width: 30px;
          height: 20px;
          position: absolute;
          background: #57f1d6;
          top: 10px;
          left: 5px;
          filter: blur(20px);
          opacity: 0.8;
          transition: all 2s;
        }

        .search-main:hover > .search-pink-mask {
          opacity: 0;
        }

        .search-white {
          max-height: 63px;
          max-width: 307px;
          border-radius: 10px;
          filter: blur(2px);
        }

        .search-white::before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(83deg);
          position: absolute;
          width: 600px;
          height: 600px;
          background-repeat: no-repeat;
          background-position: 0 0;
          filter: brightness(1.4);
          background-image: conic-gradient(
            rgba(0, 0, 0, 0) 0%,
            #7ffbe8,
            rgba(0, 0, 0, 0) 8%,
            rgba(0, 0, 0, 0) 50%,
            #57f1d6,
            rgba(0, 0, 0, 0) 58%
          );
          transition: all 2s;
        }

        .search-border {
          max-height: 59px;
          max-width: 303px;
          border-radius: 11px;
          filter: blur(0.5px);
        }

        .search-border::before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(70deg);
          position: absolute;
          width: 600px;
          height: 600px;
          filter: brightness(1.3);
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(
            #1c191c,
            #2a7a6e 5%,
            #1c191c 14%,
            #1c191c 50%,
            #57f1d6 60%,
            #1c191c 64%
          );
          transition: all 2s;
        }

        .search-dark-border-bg {
          max-height: 65px;
          max-width: 312px;
        }

        .search-dark-border-bg::before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(82deg);
          position: absolute;
          width: 600px;
          height: 600px;
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(
            rgba(0, 0, 0, 0),
            #1a5b52,
            rgba(0, 0, 0, 0) 10%,
            rgba(0, 0, 0, 0) 50%,
            #2a7a6e,
            rgba(0, 0, 0, 0) 60%
          );
          transition: all 2s;
        }

        .search-container:hover > .search-dark-border-bg::before {
          transform: translate(-50%, -50%) rotate(-98deg);
        }

        .search-container:hover > .search-glow::before {
          transform: translate(-50%, -50%) rotate(-120deg);
        }

        .search-container:hover > .search-white::before {
          transform: translate(-50%, -50%) rotate(-97deg);
        }

        .search-container:hover > .search-border::before {
          transform: translate(-50%, -50%) rotate(-110deg);
        }

        .search-container:focus-within > .search-dark-border-bg::before {
          transform: translate(-50%, -50%) rotate(442deg);
          transition: all 4s;
        }

        .search-container:focus-within > .search-glow::before {
          transform: translate(-50%, -50%) rotate(420deg);
          transition: all 4s;
        }

        .search-container:focus-within > .search-white::before {
          transform: translate(-50%, -50%) rotate(443deg);
          transition: all 4s;
        }

        .search-container:focus-within > .search-border::before {
          transform: translate(-50%, -50%) rotate(430deg);
          transition: all 4s;
        }

        .search-glow {
          overflow: hidden;
          filter: blur(30px);
          opacity: 0.4;
          max-height: 130px;
          max-width: 354px;
        }

        .search-glow:before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(60deg);
          position: absolute;
          width: 999px;
          height: 999px;
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(
            #000,
            #2a7a6e 5%,
            #000 38%,
            #000 50%,
            #57f1d6 60%,
            #000 87%
          );
          transition: all 2s;
        }

        .search-filter-icon {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          max-height: 40px;
          max-width: 38px;
          height: 100%;
          width: 100%;
          isolation: isolate;
          overflow: hidden;
          border-radius: 10px;
          background: linear-gradient(180deg, #1a1a1b, #0C0C0D, #1f1f20);
          border: 1px solid transparent;
        }

        .search-filter-border {
          height: 42px;
          width: 40px;
          position: absolute;
          overflow: hidden;
          top: 7px;
          right: 7px;
          border-radius: 10px;
        }

        .search-filter-border::before {
          content: "";
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(90deg);
          position: absolute;
          width: 600px;
          height: 600px;
          background-repeat: no-repeat;
          background-position: 0 0;
          filter: brightness(1.35);
          background-image: conic-gradient(
            rgba(0, 0, 0, 0),
            #2a2a2b,
            rgba(0, 0, 0, 0) 50%,
            rgba(0, 0, 0, 0) 50%,
            #2a2a2b,
            rgba(0, 0, 0, 0) 100%
          );
          animation: rotate-gradient 4s linear infinite;
        }

        .search-main {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 20px;
          top: 15px;
          z-index: 2;
        }
      `}</style>

      <div className="search-container">
        <div className="search-glow" />
        <div className="search-dark-border-bg" />
        <div className="search-dark-border-bg" />
        <div className="search-dark-border-bg" />
        <div className="search-white" />
        <div className="search-border" />
        <div className="search-main">
          <input
            placeholder={placeholder}
            type="text"
            name="text"
            className="search-input"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
          />
          <div className="search-input-mask" />
          <div className="search-pink-mask" />
          <div className="search-filter-border" />
          <div className="search-filter-icon">
            <svg
              preserveAspectRatio="none"
              height={27}
              width={27}
              viewBox="4.8 4.56 14.832 15.408"
              fill="none"
            >
              <path
                d="M8.16 6.65002H15.83C16.47 6.65002 16.99 7.17002 16.99 7.81002V9.09002C16.99 9.56002 16.7 10.14 16.41 10.43L13.91 12.64C13.56 12.93 13.33 13.51 13.33 13.98V16.48C13.33 16.83 13.1 17.29 12.81 17.47L12 17.98C11.24 18.45 10.2 17.92 10.2 16.99V13.91C10.2 13.5 9.97 12.98 9.73 12.69L7.52 10.36C7.23 10.08 7 9.55002 7 9.20002V7.87002C7 7.17002 7.52 6.65002 8.16 6.65002Z"
                stroke="#57f1d6"
                strokeWidth={1}
                strokeMiterlimit={10}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="search-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              height={24}
              fill="none"
            >
              <circle stroke="url(#search)" r={8} cy={11} cx={11} />
              <line stroke="url(#searchl)" y2="16.65" y1={22} x2="16.65" x1={22} />
              <defs>
                <linearGradient gradientTransform="rotate(50)" id="search">
                  <stop stopColor="#7ffbe8" offset="0%" />
                  <stop stopColor="#57f1d6" offset="50%" />
                </linearGradient>
                <linearGradient id="searchl">
                  <stop stopColor="#57f1d6" offset="0%" />
                  <stop stopColor="#2a7a6e" offset="50%" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}