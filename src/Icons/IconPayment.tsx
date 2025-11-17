  
import { RiSecurePaymentLine } from "react-icons/ri";
import { useTheme } from "../Hooks/ThemeContext"; 

interface IconDashboardsProps {
  active?: boolean;
  className?: string;
}

const IconPayment: React.FC<IconDashboardsProps> = ({ active = false, className = "" }) => {
const { mainColor } = useTheme(); 
  const iconColor = active ? mainColor : "#CCCCCC"; 
  return (
    <div className={className}>
      <RiSecurePaymentLine size={24} color={iconColor} />
    </div>
  );
};

export default IconPayment