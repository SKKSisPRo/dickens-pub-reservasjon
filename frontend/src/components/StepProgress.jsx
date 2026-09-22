// Dot x-positions (%) evenly spaced across the row; all dots sit on the same horizontal line.
const DOT_Y = 50;
const POINTS = [
  { x: 10, y: DOT_Y },
  { x: 30, y: DOT_Y },
  { x: 50, y: DOT_Y },
  { x: 70, y: DOT_Y },
  { x: 90, y: DOT_Y },
];

// Gap (in the same % units as POINTS) left between a segment's end and the dot it approaches.
const SEGMENT_GAP = 3.5;

const SEGMENTS = POINTS.slice(1).map((p, i) => {
  const prev = POINTS[i];
  return { x1: prev.x + SEGMENT_GAP, x2: p.x - SEGMENT_GAP, y: DOT_Y };
});

export default function StepProgress({ currentStep, steps, onStepClick }) {
  return (
    <div className="relative w-full max-w-3xl mx-auto h-20 mb-6 select-none">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {SEGMENTS.map((seg, i) => (
          <line
            key={i}
            x1={seg.x1}
            y1={seg.y}
            x2={seg.x2}
            y2={seg.y}
            stroke="#1E4538"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {steps.map((step, i) => {
        const point = POINTS[i];
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        const isClickable = isCompleted;

        let circleClasses =
          'w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-sm shadow-md transition-[background-color,border-color,color,box-shadow,transform] duration-200 border-2';
        if (isCompleted) {
          circleClasses += ' bg-dickens-green border-dickens-green text-white cursor-pointer hover:bg-dickens-lightgreen';
        } else if (isCurrent) {
          circleClasses += ' bg-dickens-green border-dickens-gold text-white ring-4 ring-dickens-gold/40 scale-110';
        } else {
          circleClasses += ' bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed';
        }

        return (
          <div key={step.id}>
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(step.id)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 ${circleClasses}`}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              aria-label={step.value || step.placeholder}
            >
              {isCompleted ? (
                <svg className="w-4 h-4 md:w-5 md:h-5 animate-checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.id
              )}
            </button>
            <span
              className={`absolute -translate-x-1/2 w-24 text-center text-[11px] md:text-xs font-medium leading-tight ${
                isCurrent ? 'text-dickens-green font-semibold' : isCompleted ? 'text-dickens-green' : 'text-gray-400'
              }`}
              style={{ left: `${point.x}%`, top: `calc(${point.y}% + 30px)` }}
            >
              {step.value || step.placeholder}
            </span>
          </div>
        );
      })}
    </div>
  );
}
