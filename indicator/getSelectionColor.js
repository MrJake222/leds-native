import { hslToRgb } from "../helpers";

export default function getSelectionColor(modType, preset) {
    var color = "rgba("

    switch (modType.indicatorType) {
        case "color":
            const { hue, saturation, lightness } = preset.values
            
            hslToRgb(hue/360, saturation/100, lightness/100)
                .forEach((e) => { color += e + ", " })

            color += "0.15"

            break

        default:
            color += "0, 255, 0, 0.1"
    }

    return color + ")"
} 