  ``
import { MdPayments } from "react-icons/md";
import { useTheme } from "../Hooks/ThemeContext"; 

interface IconDashboardsProps {
  active?: boolean;
  className?: string;
}

const IconPaymentmethod: React.FC<IconDashboardsProps> = ({ active = false, className = "" }) => {
  const { mainColor } = useTheme(); 
  const iconColor = active ? mainColor : "#CCCCCC"; 
  return (
    <div className={className}>
      <MdPayments  size={24} color={iconColor} />
    </div>
  );
};

export default IconPaymentmethod