export const Toolbar = ({ activeTool, onToolChange }) => {
  return (
    <div className="flex gap-2 p-2 bg-white rounded-lg shadow-lg">
      <button 
        className={activeTool === 'rect' ? 'bg-blue-200' : ''}
        onClick={() => onToolChange('rect')}
      >
        Rectangle
      </button>
      <button 
        className={activeTool === 'ellipse' ? 'bg-blue-200' : ''}
        onClick={() => onToolChange('ellipse')}
      >
        Ellipse
      </button>
      <button 
        className={activeTool === 'line' ? 'bg-blue-200' : ''}
        onClick={() => onToolChange('line')}
      >
        Line
      </button>
      {/* ... other buttons */}
    </div>
  );
};