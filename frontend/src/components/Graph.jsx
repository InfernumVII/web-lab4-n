import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPoint } from '../store/slices/pointSlice';

const Graph = () => {
  const dispatch = useDispatch();
  const { points, currentR, pagination } = useSelector((state) => state.points);
  const visiblePoints = points.slice(pagination.first, pagination.first + pagination.rows);
  const svgRef = useRef(null);

  const [cursor, setCursor] = useState({ x: 220, y: 220 });

  const SVG_SIZE = 440;
  const CENTER = 220;     
  const R_VISUAL = 176;   

  const handleMouseMove = (e) => {
    if (svgRef.current) {
      const point = new DOMPoint(e.clientX, e.clientY);
      const cursorPoint = point.matrixTransform(svgRef.current.getScreenCTM().inverse());
      setCursor({ x: cursorPoint.x, y: cursorPoint.y });
    }
  };

  const handleGraphClick = () => {
    const r = parseFloat(currentR);
    if (isNaN(r) || r < 1 || r > 3) { 
        return;
    }

    
    const globalStep = R_VISUAL / r;
    let xVal = (cursor.x - CENTER) / globalStep;
    let yVal = (CENTER - cursor.y) / globalStep;

    if (xVal > 3) xVal = 3;
    if (xVal < -5) xVal = -5;
    if (yVal > 3) yVal = 3; 
    if (yVal < -5) yVal = -5;

    xVal = parseFloat(xVal.toFixed(3));
    yVal = parseFloat(yVal.toFixed(3));

    dispatch(addPoint({ x: xVal, y: yVal, r: r }));
  };

  return (
    <div className="flex justify-content-center p-3 surface-card shadow-2 border-round overflow-hidden">
      <svg 
        ref={svgRef}
        width={SVG_SIZE} 
        height={SVG_SIZE} 
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        onMouseMove={handleMouseMove}
        onClick={handleGraphClick}
        style={{ cursor: 'none' }} 
        className="w-full h-auto block select-none"
      >
        <path 
            d={`M ${CENTER + R_VISUAL/2} ${CENTER} A ${R_VISUAL/2} ${R_VISUAL/2} 0 0 0 ${CENTER} ${CENTER - R_VISUAL/2} L ${CENTER} ${CENTER} Z`} 
            fill="rgba(66, 165, 245, 0.5)" 
            stroke="#2196F3"
        />

        <rect 
            x={CENTER - R_VISUAL} 
            y={CENTER} 
            width={R_VISUAL} 
            height={R_VISUAL} 
            fill="rgba(66, 165, 245, 0.5)" 
            stroke="#2196F3"
        />

        <polygon 
            points={`${CENTER},${CENTER} ${CENTER + R_VISUAL},${CENTER} ${CENTER},${CENTER + R_VISUAL}`} 
            fill="rgba(66, 165, 245, 0.5)" 
            stroke="#2196F3"
        />

        <line x1="0" y1={CENTER} x2={SVG_SIZE} y2={CENTER} stroke="var(--text-color)" strokeWidth="1" />
        <line x1={CENTER} y1="0" x2={CENTER} y2={SVG_SIZE} stroke="var(--text-color)" strokeWidth="1" />

        <polygon points={`${SVG_SIZE},${CENTER} ${SVG_SIZE-10},${CENTER-5} ${SVG_SIZE-10},${CENTER+5}`} fill="var(--text-color)" />
        <polygon points={`${CENTER},0 ${CENTER-5},10 ${CENTER+5},10`} fill="var(--text-color)" />
        <text x={SVG_SIZE - 20} y={CENTER - 10} fill="var(--text-color)">X</text>
        <text x={CENTER + 10} y={20} fill="var(--text-color)">Y</text>

        <line x1={CENTER-5} x2={CENTER+5} y1={CENTER - R_VISUAL} y2={CENTER - R_VISUAL} stroke="var(--text-color)" strokeWidth="1"/>
        <text x={CENTER+10} y={CENTER - R_VISUAL + 5} fill="var(--text-color)">R</text>

        <line x1={CENTER-5} x2={CENTER+5} y1={CENTER - R_VISUAL/2} y2={CENTER - R_VISUAL/2} stroke="var(--text-color)" strokeWidth="1"/>
        <text x={CENTER+10} y={CENTER - R_VISUAL/2 + 5} fill="var(--text-color)">R/2</text>

        <line x1={CENTER-5} x2={CENTER+5} y1={CENTER + R_VISUAL} y2={CENTER + R_VISUAL} stroke="var(--text-color)" strokeWidth="1"/>
        <text x={CENTER+10} y={CENTER + R_VISUAL + 5} fill="var(--text-color)">-R</text>

        <line x1={CENTER-5} x2={CENTER+5} y1={CENTER + R_VISUAL/2} y2={CENTER + R_VISUAL/2} stroke="var(--text-color)" strokeWidth="1"/>
        <text x={CENTER+10} y={CENTER + R_VISUAL/2 + 5} fill="var(--text-color)">-R/2</text>

        <line x1={CENTER + R_VISUAL} x2={CENTER + R_VISUAL} y1={CENTER-5} y2={CENTER+5} stroke="var(--text-color)" strokeWidth="1"/>
        <text x={CENTER + R_VISUAL - 5} y={CENTER - 10} fill="var(--text-color)">R</text>

        <line x1={CENTER + R_VISUAL/2} x2={CENTER + R_VISUAL/2} y1={CENTER-5} y2={CENTER+5} stroke="var(--text-color)" strokeWidth="1"/>
        <text x={CENTER + R_VISUAL/2 - 10} y={CENTER - 10} fill="var(--text-color)">R/2</text>

        <line x1={CENTER - R_VISUAL} x2={CENTER - R_VISUAL} y1={CENTER-5} y2={CENTER+5} stroke="var(--text-color)" strokeWidth="1"/>
        <text x={CENTER - R_VISUAL - 5} y={CENTER - 10} fill="var(--text-color)">-R</text>

        <line x1={CENTER - R_VISUAL/2} x2={CENTER - R_VISUAL/2} y1={CENTER-5} y2={CENTER+5} stroke="var(--text-color)" strokeWidth="1"/>
        <text x={CENTER - R_VISUAL/2 - 10} y={CENTER - 10} fill="var(--text-color)">-R/2</text>


        {visiblePoints.map((p) => {
            const rVal = parseFloat(currentR) || 1;
            const globalStep = R_VISUAL / rVal;

            const cx = CENTER + globalStep * p.x;
            const cy = CENTER - globalStep * p.y;

            return (
                <circle 
                    key={p.id} 
                    cx={cx} 
                    cy={cy} 
                    r="5" 
                    fill={p.hit ? "#00FF00" : "#FF0000"} 
                    stroke="black" 
                    strokeWidth="1"
                    className="transition-all transition-duration-300"
                />
            );
        })}

        <circle 
            cx={cursor.x} 
            cy={cursor.y} 
            r="5" 
            fill="rgba(255, 255, 255, 0.5)" 
            stroke="var(--text-color)" 
            strokeWidth="1"
            style={{ pointerEvents: 'none' }}
        />

      </svg>
    </div>
  );
};

export default Graph;