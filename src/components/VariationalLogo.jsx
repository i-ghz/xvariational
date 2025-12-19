export function VariationalLogo({ className, color = "currentColor" }) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M20 70 L30 70 L45 35 Q50 25 55 35 L70 70 L80 70"
                stroke={color}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-100" // Base outer mountain
            />
            {/* 
         Approximating the logo manually: 
         It looks like 3 nested waves forming a peak.
         Let's try a more accurate path construction.
      */}
            <path
                d="M25 75 H75 M35 75 Q50 20 65 75 M42 75 Q50 40 58 75"
                stroke="none"
                fill="none"
            />
            {/* 
        Re-drawing based on the 'A' shape with 3 lines. 
        Outer line: Start bottom left, curve up high, curve down right.
        Middle line: Start bottom slightly right, curve up lower, curve down.
        Inner line: Smallest curve.
       */}
            <path
                d="M15 75 C 35 75, 35 30, 50 30 C 65 30, 65 75, 85 75"
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
            />
            <path
                d="M32 75 C 42 75, 42 45, 50 45 C 58 45, 58 75, 68 75"
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
            />
            <path
                d="M48 75 C 50 75, 50 60, 50 60 C 50 60, 50 75, 52 75"
                stroke={color}
                strokeWidth="8" // This one is tricky, usually logos are filled paths not strokes.
                strokeLinecap="round"
                fill="none"
                className="hidden"
            />
        </svg>
    )
}

// Better Implementation: Using a more simplified geometric approximation since I can't trace perfectly without tools.
// The logo is 3 swoops.
export function VariationalLogov2({ className, classNamePath = "" }) {
    return (
        <svg viewBox="0 0 365 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            {/* Outer Swoop */}
            <path
                d="M5 195 L50 195 C 60 195, 90 5, 140 5 C 190 5, 220 195, 230 195 L275 195"
                stroke="currentColor"
                strokeWidth="25"
                strokeLinecap="round"
                className={classNamePath}
            />
            {/* Middle Swoop */}
            <path
                d="M90 195 L115 195 C 120 195, 140 80, 165 80 C 190 80, 210 195, 215 195 L240 195"
                stroke="currentColor"
                strokeWidth="25"
                strokeLinecap="round"
                className={classNamePath}
            />
            {/* Inner Swoop */}
            <path
                d="M165 195 L175 195 C 180 195, 190 140, 200 140 C 210 140, 220 195, 225 195 L235 195"
                stroke="currentColor"
                strokeWidth="25"
                strokeLinecap="round"
                className={classNamePath}
            />
        </svg>
    )
}
