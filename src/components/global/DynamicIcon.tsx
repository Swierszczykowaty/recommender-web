import { SvgIconComponent } from "@mui/icons-material";
import StorageIcon from "@mui/icons-material/Storage";
import MovieIcon from "@mui/icons-material/Movie";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LocalActivityIcon from '@mui/icons-material/LocalActivity'; // Przykładowa inna ikona

// Mapa, która łączy string (np. "storage") z zaimportowanym komponentem ikony
const iconMap: { [key: string]: SvgIconComponent } = {
  storage: StorageIcon,
  movie: MovieIcon,
  play: PlayArrowIcon,
  ticket: LocalActivityIcon,
  // ...dodaj tutaj kolejne ikony, których potrzebujesz
};

type DynamicIconProps = {
  name: string;
  className?: string;
};

// Komponent, który renderuje odpowiednią ikonę na podstawie nazwy
export default function DynamicIcon({ name, className }: DynamicIconProps) {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    // Zabezpieczenie, jeśli ikona o danej nazwie nie istnieje w mapie
    return null;
  }

  return <IconComponent className={className} />;
}