import { NavigationContainerComponent, NavigationActions, NavigationParams } from "react-navigation";

var rootNavigatorRef: NavigationContainerComponent

export function setRootNavigatorRef(navigatorRef: NavigationContainerComponent) {
    rootNavigatorRef = navigatorRef
}

export function rootNavigatorNavigate(routeName: string, params?: NavigationParams) {
    rootNavigatorRef!.dispatch(
        NavigationActions.navigate({
            routeName,
            params
        })
    )
}
