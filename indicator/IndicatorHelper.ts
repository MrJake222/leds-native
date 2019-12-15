import ModType from "../types/ModType";
import IndicatorColor from "./IndicatorColor";
import { ReactElement } from "react";
import Preset from "../types/Preset";

export interface IndicatorInterface {
    create(data: any, height?: number): ReactElement
    selectionColor(preset: Preset): string
}

export default class IndicatorHelper {
    static indicators: {[key: string]: IndicatorInterface} = {
        "color": new IndicatorColor()
    }

    static indicator(indicatorType: string): IndicatorInterface {
        return IndicatorHelper.indicators[indicatorType]
    }

    static indicatorMod({ indicatorType }: ModType): IndicatorInterface {
        return IndicatorHelper.indicator(indicatorType)
    }
}