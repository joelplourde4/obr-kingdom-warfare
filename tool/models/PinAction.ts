import OBR, { ToolAction, ToolIcon } from "@owlbear-rodeo/sdk";
import { TOOL_ID } from "../main";

export class PinAction implements ToolAction {
    public readonly id: string = `${TOOL_ID}/pin-action`;

    get icons(): ToolIcon[] {
        return [{
            icon: '/settings.svg',
            label: 'Settings',
            filter: {
                activeTools: [`${TOOL_ID}/tool`],
            },
        }];
    }

    onClick(_: any, elementId: any) {
        OBR.popover.open({
          id: `${TOOL_ID}/pin-action`,
          height: 45,
          width: 80,
          url: "/tool/index.html",
          anchorElementId: elementId,
          anchorOrigin: {
            horizontal: "CENTER",
            vertical: "BOTTOM",
          },
          transformOrigin: {
            horizontal: "CENTER",
            vertical: "TOP",
          },
        });
    }
}