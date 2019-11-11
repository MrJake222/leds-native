import { NavigationActions } from "react-navigation";

var rootNavigatorRef

export function setRootNavigatorRef(navigatorRef) {
    rootNavigatorRef = navigatorRef
}

export function rootNavigatorNavigate(routeName, params) {
    rootNavigatorRef.dispatch(
        NavigationActions.navigate({
            routeName,
            params
        })
    )
}
