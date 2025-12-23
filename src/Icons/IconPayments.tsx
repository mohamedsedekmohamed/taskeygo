import { RiSecurePaymentFill } from "react-icons/ri";

import { useTheme } from "../Hooks/ThemeContext"; 

interface IconDashboardsProps {
  active?: boolean;
  className?: string;
}

const IconPayments: React.FC<IconDashboardsProps> = ({ active = false, className = "" }) => {
const { mainColor } = useTheme(); 
  const iconColor = active ? mainColor : "#CCCCCC"; 
  return (
    <div className={className}>
      <RiSecurePaymentFill size={24} color={iconColor} />
    </div>
  );
};


export default IconPayments