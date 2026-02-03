import React from 'react';

// =========================================================================
//  캔디 크러쉬 사가 스타일 SVG 캔디 - 100% 정밀 재현 (최종)
//  색상 채도 및 하이라이트 극대화
// =========================================================================

interface CandyShapeProps {
    className?: string;
    style?: React.CSSProperties;
}

// -------------------------------------------------------------------------
// 1. RED JELLY BEAN
// -------------------------------------------------------------------------
export const RedBean: React.FC<CandyShapeProps> = (props) => (
    <svg viewBox="0 0 100 100" {...props} style={{ overflow: 'visible', ...props.style }}>
        <defs>
            <radialGradient id="redBody" cx="25%" cy="25%" r="75%">
                <stop offset="0%" stopColor="#ff6666" />
                <stop offset="30%" stopColor="#ff0000" />
                <stop offset="65%" stopColor="#cc0000" />
                <stop offset="100%" stopColor="#660000" />
            </radialGradient>
            <radialGradient id="redSpec" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.5)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <filter id="redShadow">
                <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#330000" floodOpacity="0.6" />
            </filter>
        </defs>
        <g transform="rotate(-28, 50, 50)">
            <ellipse cx="50" cy="50" rx="46" ry="12" fill="url(#redBody)" filter="url(#redShadow)" />
            <ellipse cx="50" cy="47" rx="20" ry="3" fill="rgba(100,0,0,0.5)" />
            <ellipse cx="50" cy="55" rx="32" ry="4" fill="rgba(255,100,100,0.25)" />
        </g>
        <ellipse cx="26" cy="35" rx="16" ry="7" fill="url(#redSpec)" transform="rotate(-28, 26, 35)" />
        <ellipse cx="22" cy="32" rx="6" ry="3" fill="#ffffff" transform="rotate(-28, 22, 32)" />
    </svg>
);

// -------------------------------------------------------------------------
// 2. ORANGE LOZENGE
// -------------------------------------------------------------------------
export const OrangeLozenge: React.FC<CandyShapeProps> = (props) => (
    <svg viewBox="0 0 100 100" {...props}>
        <defs>
            <radialGradient id="orangeBody" cx="25%" cy="25%" r="80%">
                <stop offset="0%" stopColor="#ffcc66" />
                <stop offset="25%" stopColor="#ff9900" />
                <stop offset="60%" stopColor="#ee7700" />
                <stop offset="100%" stopColor="#994400" />
            </radialGradient>
            <linearGradient id="orangeBand" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="35%" stopColor="rgba(255,255,255,0.75)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.9)" />
                <stop offset="65%" stopColor="rgba(255,255,255,0.75)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <filter id="orangeShadow">
                <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#663300" floodOpacity="0.6" />
            </filter>
        </defs>
        <ellipse cx="50" cy="50" rx="47" ry="12" fill="url(#orangeBody)" filter="url(#orangeShadow)" />
        <ellipse cx="50" cy="50" rx="38" ry="7" fill="url(#orangeBand)" />
        <ellipse cx="16" cy="44" rx="11" ry="5" fill="rgba(255,255,255,0.95)" />
        <ellipse cx="14" cy="42" rx="4" ry="2" fill="#ffffff" />
    </svg>
);

// -------------------------------------------------------------------------
// 3. YELLOW LEMON DROP
// -------------------------------------------------------------------------
export const YellowDrop: React.FC<CandyShapeProps> = (props) => (
    <svg viewBox="0 0 100 100" {...props}>
        <defs>
            <radialGradient id="yellowBody" cx="35%" cy="45%" r="58%">
                <stop offset="0%" stopColor="#ffffcc" />
                <stop offset="20%" stopColor="#ffee00" />
                <stop offset="55%" stopColor="#ffcc00" />
                <stop offset="100%" stopColor="#996600" />
            </radialGradient>
            <filter id="yellowShadow">
                <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#664400" floodOpacity="0.5" />
            </filter>
        </defs>
        <path
            d="M50,5 
               C60,22 82,48 82,68
               C82,90 68,98 50,98
               C32,98 18,90 18,68
               C18,48 40,22 50,5 Z"
            fill="url(#yellowBody)"
            filter="url(#yellowShadow)"
        />
        <ellipse cx="34" cy="55" rx="11" ry="24" fill="rgba(255,255,255,0.9)" transform="rotate(-18, 34, 55)" />
        <ellipse cx="30" cy="45" rx="5" ry="8" fill="#ffffff" transform="rotate(-18, 30, 45)" />
    </svg>
);

// -------------------------------------------------------------------------
// 4. GREEN SQUARE
// -------------------------------------------------------------------------
export const GreenSquare: React.FC<CandyShapeProps> = (props) => (
    <svg viewBox="0 0 100 100" {...props}>
        <defs>
            <radialGradient id="greenBody" cx="20%" cy="20%" r="90%">
                <stop offset="0%" stopColor="#66ff66" />
                <stop offset="25%" stopColor="#00dd00" />
                <stop offset="60%" stopColor="#00aa00" />
                <stop offset="100%" stopColor="#004400" />
            </radialGradient>
            <filter id="greenShadow">
                <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#002200" floodOpacity="0.5" />
            </filter>
        </defs>
        <g transform="rotate(-2, 50, 50)">
            <rect x="6" y="6" width="88" height="88" rx="18" ry="18" fill="url(#greenBody)" filter="url(#greenShadow)" />
            <rect x="12" y="12" width="76" height="76" rx="15" ry="15" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
        </g>
        <path d="M16,28 Q38,8 60,20 L26,62 Z" fill="rgba(255,255,255,0.8)" transform="rotate(-2, 50, 50)" />
        <path d="M20,30 Q32,18 45,24 L28,48 Z" fill="#ffffff" opacity="0.6" transform="rotate(-2, 50, 50)" />
    </svg>
);

// -------------------------------------------------------------------------
// 5. BLUE SPHERE
// -------------------------------------------------------------------------
export const BlueSphere: React.FC<CandyShapeProps> = (props) => (
    <svg viewBox="0 0 100 100" {...props}>
        <defs>
            <radialGradient id="blueBody" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#66ccff" />
                <stop offset="25%" stopColor="#0099ff" />
                <stop offset="60%" stopColor="#0066cc" />
                <stop offset="100%" stopColor="#003366" />
            </radialGradient>
            <radialGradient id="blueSpec" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.5)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <filter id="blueShadow">
                <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#001133" floodOpacity="0.6" />
            </filter>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#blueBody)" filter="url(#blueShadow)" />
        <path d="M50,8 Q92,28 92,50 Q92,78 50,92" fill="none" stroke="rgba(150,220,255,0.55)" strokeWidth="12" strokeLinecap="round" />
        <path d="M50,12 Q12,32 10,55 Q12,80 50,92" fill="none" stroke="rgba(150,220,255,0.45)" strokeWidth="10" strokeLinecap="round" />
        <path d="M28,18 Q58,32 72,62" fill="none" stroke="rgba(200,240,255,0.35)" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="28" cy="28" rx="20" ry="15" fill="url(#blueSpec)" />
        <circle cx="22" cy="22" r="8" fill="#ffffff" />
    </svg>
);

// -------------------------------------------------------------------------
// 6. PURPLE FLOWER
// -------------------------------------------------------------------------
export const PurpleFlower: React.FC<CandyShapeProps> = (props) => (
    <svg viewBox="0 0 100 100" {...props}>
        <defs>
            <radialGradient id="purplePetal" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#cc99ff" />
                <stop offset="35%" stopColor="#9933ff" />
                <stop offset="70%" stopColor="#6600cc" />
                <stop offset="100%" stopColor="#330066" />
            </radialGradient>
            <radialGradient id="purpleCenter" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#eeddff" />
                <stop offset="100%" stopColor="#9966cc" />
            </radialGradient>
            <filter id="purpleShadow">
                <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#220033" floodOpacity="0.6" />
            </filter>
        </defs>
        {/* 꽃잎들 - 더 중앙으로 밀집, 겹침 증가 */}
        <g filter="url(#purpleShadow)">
            <circle cx="50" cy="20" r="24" fill="url(#purplePetal)" />
            <circle cx="78" cy="40" r="24" fill="url(#purplePetal)" />
            <circle cx="67" cy="74" r="24" fill="url(#purplePetal)" />
            <circle cx="33" cy="74" r="24" fill="url(#purplePetal)" />
            <circle cx="22" cy="40" r="24" fill="url(#purplePetal)" />
        </g>
        {/* 각 꽃잎 하이라이트 */}
        <circle cx="42" cy="12" r="9" fill="rgba(255,255,255,0.85)" />
        <circle cx="70" cy="32" r="8" fill="rgba(255,255,255,0.75)" />
        <circle cx="60" cy="66" r="7" fill="rgba(255,255,255,0.65)" />
        <circle cx="26" cy="66" r="7" fill="rgba(255,255,255,0.65)" />
        <circle cx="16" cy="34" r="8" fill="rgba(255,255,255,0.75)" />
        {/* 중앙 장식 */}
        <circle cx="50" cy="48" r="16" fill="url(#purpleCenter)" />
        <circle cx="44" cy="42" r="5" fill="rgba(255,255,255,0.9)" />
        <circle cx="42" cy="40" r="2" fill="#ffffff" />
    </svg>
);

// -------------------------------------------------------------------------
// 7. COLOR BOMB
// -------------------------------------------------------------------------
export const ColorBomb: React.FC<CandyShapeProps> = (props) => (
    <svg viewBox="0 0 100 100" {...props}>
        <defs>
            <radialGradient id="chocoBody" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#a67b5b" />
                <stop offset="35%" stopColor="#6b4423" />
                <stop offset="70%" stopColor="#3d2314" />
                <stop offset="100%" stopColor="#1a0a05" />
            </radialGradient>
            <filter id="chocoShadow">
                <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#0a0503" floodOpacity="0.7" />
            </filter>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#chocoBody)" filter="url(#chocoShadow)" />
        <g>
            <rect x="24" y="20" width="8" height="18" rx="4" fill="#ff3333" transform="rotate(40, 28, 29)" />
            <rect x="55" y="15" width="8" height="18" rx="4" fill="#00cc66" transform="rotate(-30, 59, 24)" />
            <rect x="76" y="40" width="8" height="18" rx="4" fill="#ffcc00" transform="rotate(55, 80, 49)" />
            <rect x="58" y="66" width="8" height="18" rx="4" fill="#0099ff" transform="rotate(-20, 62, 75)" />
            <rect x="22" y="58" width="8" height="18" rx="4" fill="#ff6699" transform="rotate(25, 26, 67)" />
            <rect x="38" y="32" width="7" height="16" rx="3" fill="#9933ff" transform="rotate(-45, 41, 40)" />
            <rect x="66" y="26" width="7" height="16" rx="3" fill="#33cc99" transform="rotate(15, 69, 34)" />
        </g>
        <ellipse cx="30" cy="28" rx="15" ry="11" fill="rgba(255,255,255,0.65)" transform="rotate(-30, 30, 28)" />
        <circle cx="24" cy="22" r="6" fill="#ffffff" />
    </svg>
);
