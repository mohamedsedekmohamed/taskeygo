import { BiError } from "react-icons/bi";
import { useTheme } from "../Hooks/ThemeContext"; 

interface IconrejectedProps {
  active?: boolean;
  className?: string;
}

const Iconrejected: React.FC<IconrejectedProps> = ({ active = false, className = "" }) => {
const { mainColor } = useTheme(); 
  const iconColor = active ? mainColor : "#CCCCCC"; 

  return (
    <div className={className}>
      <BiError size={24} color={iconColor} />
    </div>
  );
};

export default Iconrejected