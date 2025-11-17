import { GrUserAdmin } from "react-icons/gr";
import { useTheme } from "../Hooks/ThemeContext"; 

interface IconDashboardsProps {
  active?: boolean;
  className?: string;
}

const IconDashboard: React.FC<IconDashboardsProps> = ({ active = false, className = "" }) => {
  const { mainColor } = useTheme(); 
  const iconColor = active ? mainColor : "#CCCCCC"; 

  return (
    <div className={className}>
      <GrUserAdmin size={24} color={iconColor} />
    </div>
  );
};

export default IconDashboard;
