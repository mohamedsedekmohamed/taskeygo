  
import { TbShoppingCartDiscount } from "react-icons/tb";
import { useTheme } from "../Hooks/ThemeContext"; 

interface IconDashboardsProps {
  active?: boolean;
  className?: string;
}

const IconCoupon: React.FC<IconDashboardsProps> = ({ active = false, className = "" }) => {
const { mainColor } = useTheme(); 
  const iconColor = active ? mainColor : "#CCCCCC"; 

  return (
    <div className={className}>
      <TbShoppingCartDiscount size={24} color={iconColor} />
    </div>
  );
};

export default IconCoupon