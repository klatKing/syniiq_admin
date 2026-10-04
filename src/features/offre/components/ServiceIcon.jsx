import { Layers } from "lucide-react";
import { resoudreUrlMedia } from "../../../config/constants";
import { SERVICE_ICONS } from "./serviceIcons";

export default function ServiceIcon({ icon, className = "h-6 w-6" }) {
  if (icon && /^(https?:\/\/|\/)/.test(icon)) {
    return <img src={resoudreUrlMedia(icon)} alt="" className={`${className} object-contain`} />;
  }
  const Icon = SERVICE_ICONS[icon] ?? Layers;
  return <Icon className={className} />;
}