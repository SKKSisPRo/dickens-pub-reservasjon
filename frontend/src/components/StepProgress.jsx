// Dot x-positions (%) evenly spaced across the row; all dots sit on the same horizontal line.
const DOT_Y = 50;
const POINTS = [
  { x: 10, y: DOT_Y },
  { x: 30, y: DOT_Y },
  { x: 50, y: DOT_Y },
  { x: 70, y: DOT_Y },
  { x: 90, y: DOT_Y },
];

function buildLinePath(points) {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
}

const LINE_PATH = buildLinePath(POINTS);

export default function StepProgress({ currentStep, steps, onStepClick }) {
  return (
    <div className="relative w-full max-w-3xl mx-auto h-20 mb-6 select-none">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d={LINE_PATH}
          fill="none"
          stroke="#D1D5DB"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {steps.map((step, i) => {
        const point = POINTS[i];
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        const isClickable = isCompleted;

        let circleClasses =
          'w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-sm shadow-md transition-all duration-200 border-2';
        if (isCompleted) {
          circleClasses += ' bg-dickens-green border-dickens-green text-white cursor-pointer hover:bg-dickens-lightgreen';
        } else if (isCurrent) {
          circleClasses += ' bg-dickens-green border-dickens-gold text-white ring-4 ring-dickens-gold/40 scale-110';
        } else {
          circleClasses += ' bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed';
        }

        return (
          <div
            key={step.id}
            className="absolute flex flex-col items-center gap-2 w-24 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(step.id)}
              className={circleClasses}
              aria-label={step.value || step.placeholder}
            >
              {isCompleted ? (
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.id
              )}
            </button>
            <span
              className={`text-[11px] md:text-xs text-center font-medium leading-tight ${
                isCurrent ? 'text-dickens-green font-semibold' : isCompleted ? 'text-dickens-green' : 'text-gray-400'
              }`}
            >
              {step.value || step.placeholder}
            </span>
          </div>
        );
      })}
    </div>
  );
}
