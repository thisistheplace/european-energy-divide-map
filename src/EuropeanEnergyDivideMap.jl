
module EuropeanEnergyDivideMap
using Dash

const resources_path = realpath(joinpath( @__DIR__, "..", "deps"))
const version = "0.0.1"

include("jl/europeanenergydividemap.jl")

function __init__()
    DashBase.register_package(
        DashBase.ResourcePkg(
            "european_energy_divide_map",
            resources_path,
            version = version,
            [
                DashBase.Resource(
    relative_package_path = "european_energy_divide_map.min.js",
    external_url = "https://unpkg.com/european_energy_divide_map@0.0.1/european_energy_divide_map/european_energy_divide_map.min.js",
    dynamic = nothing,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "european_energy_divide_map.min.js.map",
    external_url = "https://unpkg.com/european_energy_divide_map@0.0.1/european_energy_divide_map/european_energy_divide_map.min.js.map",
    dynamic = true,
    async = nothing,
    type = :js
)
            ]
        )

    )
end
end
