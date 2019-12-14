import ModType from "../types/ModType";
import IndicatorColor from "./IndicatorColor";
import { ReactElement } from "react";

export interface IndicatorInterface {
    create(data: any, height?: number): ReactElement
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