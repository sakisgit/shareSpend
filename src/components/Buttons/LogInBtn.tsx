
interface LogInBtnProps {
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
};

const LogInBtn: React.FC<LogInBtnProps> = ({ onClick, disabled = false, children }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-lg font-semibold px-5 py-2.5 rounded-xl transition-all ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
      }`}
    >
      <img src="/assets/LogIcons/log-in.png" alt="Log In" className="w-5 h-5" />
      <span>{children || 'Log In'}</span>
    </button>
  );
};

export default LogInBtn;
