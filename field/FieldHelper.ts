import ModField from "../types/ModField";
import FieldSmooth from "./FieldSmooth";
import { ReactElement } from "react";

export interface FieldInterface {
    create(field: ModField, value: any, onValueChange: (value: any) => void): ReactElement
}

export default class FieldHelper {
    static fields: {[key: string]: FieldInterface} = {
        "smooth": new FieldSmooth()
    }

    static field({ type }: ModField): FieldInterface {
        return FieldHelper.fields[type]
    }
}