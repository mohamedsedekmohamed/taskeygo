  import { useTheme } from "../Hooks/ThemeContext"; 

import { GiShadowFollower } from "react-icons/gi";
interface IconDashboardsProps {
  active?: boolean;
  className?: string;
}

const IconSubscription: React.FC<IconDashboardsProps> = ({ active = false, className = "" }) => {
  const { mainColor } = useTheme(); 
  const iconColor = active ? mainColor : "#CCCCCC"; 
  return (
    <div className={className}>
      <GiShadowFollower size={24} color={iconColor} />
    </div>
  );
};

export default IconSubscription