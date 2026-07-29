import { PlacementWithLogical } from "@chakra-ui/react";
import { IconType } from "react-icons";
interface Props {
    buttonText: string;
    placement: PlacementWithLogical;
    icon?: IconType;
    width: string;
    color: string;
}
declare const NotAuthorized: ({ buttonText, icon, placement, width, color, }: Props) => import("react").JSX.Element;
export default NotAuthorized;
