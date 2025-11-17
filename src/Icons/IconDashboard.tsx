  
import { RiHome5Line } from "react-icons/ri";
import { useTheme } from "../Hooks/ThemeContext"; 

interface IconDashboardsProps {
  active?: boolean;
  className?: string;
}

const IconAdmin: React.FC<IconDashboardsProps> = ({ active = false, className = "" }) => {
const { mainColor } = useTheme(); 
  const iconColor = active ? mainColor : "#CCCCCC"; 
  return (
    <div className={className}>
      <RiHome5Line size={24} color={iconColor} />
    </div>
  );
};

export default IconAdmin