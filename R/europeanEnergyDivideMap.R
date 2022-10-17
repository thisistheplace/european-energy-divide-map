# AUTO GENERATED FILE - DO NOT EDIT

#' @export
europeanEnergyDivideMap <- function(id=NULL) {
    
    props <- list(id=id)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'EuropeanEnergyDivideMap',
        namespace = 'european_energy_divide_map',
        propNames = c('id'),
        package = 'europeanEnergyDivideMap'
        )

    structure(component, class = c('dash_component', 'list'))
}
