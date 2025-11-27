
interface CustomButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    color?: 'blue' |'red' | 'gray' | 'green';
    size?:'sm' | 'md' | 'lg';
    disabled?: boolean;
};

const CustomButton: React.FC <CustomButtonProps> = ({
    children,
    onClick,
    color='blue',
    size='md',
    disabled = false,
}) => {
    const baseClasses = "text-white rounded-lg transition flex items-center justify-center";
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90";

    const colorClasses = {
        blue: "bg-blue-500 hover:bg-blue-600",
        red: "bg-red-500 hover:bg-red-600",
        gray: "bg-gray-500 hover:bg-gray-600",
        green: "bg-green-500 hover:bg-green-600",
    };

    const sizeClasses = {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };
  return (
    <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`${baseClasses} ${colorClasses[color]} ${sizeClasses[size]} ${disabledClasses}`}
    >
        {children}
    </button>
    
  );
};

export default CustomButton;