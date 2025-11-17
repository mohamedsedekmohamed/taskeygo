import { useTheme } from "../Hooks/ThemeContext"; 
import { PiHandDepositFill } from "react-icons/pi";

interface IconDepartmentsProps {
  active?: boolean;
  className?: string;
}

const IconDepartments: React.FC<IconDepartmentsProps> = ({ active = false, className = "" }) => {
const { mainColor } = useTheme(); 
  const iconColor = active ? mainColor : "#CCCCCC"; 
  return (
    <div className={className}>
      <PiHandDepositFill size={24} color={iconColor} />
    </div>
  );
};

export default IconDepartments