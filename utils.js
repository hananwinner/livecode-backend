
function extarctFieldsFilter(filters) {
    var fields = undefined;
    if (filters.fields) {        
        fields = (' ' + filters.fields).slice(1);
        delete filters.fields
    }
    return fields
}

module.exports.extarctFieldsFilter = extarctFieldsFilter;
