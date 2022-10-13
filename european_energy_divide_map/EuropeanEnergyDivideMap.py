# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class EuropeanEnergyDivideMap(Component):
    """An EuropeanEnergyDivideMap component.


Keyword arguments:

- id (string; required):
    The ID used to identify the container for the IFC viewer
    component."""
    _children_props = []
    _base_nodes = ['children']
    _namespace = 'european_energy_divide_map'
    _type = 'EuropeanEnergyDivideMap'
    @_explicitize_args
    def __init__(self, id=Component.REQUIRED, **kwargs):
        self._prop_names = ['id']
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id']
        self.available_wildcard_properties =            []
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        for k in ['id']:
            if k not in args:
                raise TypeError(
                    'Required argument `' + k + '` was not specified.')

        super(EuropeanEnergyDivideMap, self).__init__(**args)
