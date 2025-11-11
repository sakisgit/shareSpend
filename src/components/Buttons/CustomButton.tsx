
interface CustomButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    color?: 'blue' |'red' | 'gray';
    size?:'sm' | 'md' | 'lg'; 
}

const CustomButton: React.FC <CustomButtonProps> = ({
    children,
    onClick,
    color='blue',
    size='md',
}) => {
    const baseClasses = "text-white rounded-lg transition hover:opacity-90 flex items-center justify-center";

    const colorClasses = {
        blue: "bg-blue-500 hover:bg-blue-600",
        red: "bg-red-500 hover:bg-red-600",
        gray: "bg-gray-500 hover:bg-gray-600",
    };

    const sizeClasses = {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };
  return (
    <button
        onClick={onClick}
        className={`${baseClasses} ${colorClasses[color]} ${sizeClasses[size]}`}
    >
        {children}
    </button>
    
  ) 
}

export default CustomButton