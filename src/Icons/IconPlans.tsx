  import { useTheme } from "../Hooks/ThemeContext"; 

import { FaChartGantt } from "react-icons/fa6";
interface IconDashboardsProps {
  active?: boolean;
  className?: string;
}

const IconPlans: React.FC<IconDashboardsProps> = ({ active = false, className = "" }) => {
  const { mainColor } = useTheme(); 
  const iconColor = active ? mainColor : "#CCCCCC"; 
  return (
    <div className={className}>
      <FaChartGantt  size={24} color={iconColor} />
    </div>
  );
};

export default IconPlans