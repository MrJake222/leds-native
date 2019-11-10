import IndicatorColor from "./IndicatorColor"


export default function getIndicator({indicatorType}) {
    var IndicatorClass = []

    switch (indicatorType) {
        case "color":
            IndicatorClass = IndicatorColor
            break
    }

    return IndicatorClass
}