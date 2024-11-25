import { Metadata, Tool, ToolFilter, ToolIcon } from "@owlbear-rodeo/sdk";
import { TOOL_ID } from "../main";

/**
 * The Pin Tool is display in the right-side menu of the screen.
 */
export class PinTool implements Tool {

    id: string = `${TOOL_ID}/tool`;
    
    icons: ToolIcon[] = [
        {
          icon: "/pin.svg",
          label: "Pin",
        },
    ];

    disabled: ToolFilter = {
        roles: ["PLAYER"]
    }

    defaultMetadata: Metadata = {
        iconKey: "pin"
    }

    shortcut = "P";
}