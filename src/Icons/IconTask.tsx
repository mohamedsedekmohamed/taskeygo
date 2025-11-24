import { GoTasklist } from "react-icons/go";
import { useTheme } from "../Hooks/ThemeContext"; 

interface IconTaskProps {
  active?: boolean;
  className?: string;
}

const IconTask: React.FC<IconTaskProps> = ({ active = false, className = "" }) => {
const { mainColor } = useTheme(); 
  const iconColor = active ? mainColor : "#CCCCCC"; 
  return (
    <div className={className}>
      <GoTasklist size={24} color={iconColor} />
    </div>
  );
};

export default IconTask