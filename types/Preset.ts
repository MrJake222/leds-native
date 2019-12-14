export default interface Preset {
    _id: string
    presetName: string
    modType: string
    values: {[valueName: string]: any}
}