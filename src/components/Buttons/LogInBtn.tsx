
interface LogInBtnProps {
  onClick: () => void;
};

const LogInBtn: React.FC<LogInBtnProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-lg font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all"
    >
      <img src="/assets/LogIcons/log-in.png" alt="Log In" className="w-5 h-5" />
      <span>Log In</span>
    </button>
  )
}

export default LogInBtn
