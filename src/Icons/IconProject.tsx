import { useTheme } from "../Hooks/ThemeContext"; 
import { GoProjectSymlink } from "react-icons/go";

interface IconProjectProps {
  active?: boolean;
  className?: string;
}

const IconProject: React.FC<IconProjectProps> = ({ active = false, className = "" }) => {
const { mainColor } = useTheme(); 
  const iconColor = active ? mainColor : "#CCCCCC"; 
  return (
    <div className={className}>
      <GoProjectSymlink size={24} color={iconColor} />
    </div>
  );
};
export default IconProject