// const validTopLevelFields = ['file', 'time', '_id', 'data']

export const validateMongooseQuery = (value) => {
    return !!value
    // try {
    //     if (!value) return false
    //     const parsed = JSON.parse(value)

    //     // Allow empty query
    //     if (Object.keys(parsed).length === 0) return true

    //     return Object.keys(parsed).every((key) => {
    //         // Split key to handle data.* notation
    //         const [baseKey, ...subKeys] = key.split('.')

    //         // Check if base key is valid
    //         if (!validTopLevelFields.includes(baseKey)) return false

    //         // If it's not 'data' and has subkeys, it's invalid (only one level allowed)
    //         if (baseKey !== 'data' && subKeys.length > 0) return false

    //         const value = parsed[key]

    //         // For file and time, must be string if not an object
    //         if (baseKey === 'file' || baseKey === 'time') {
    //             if (typeof value !== 'object') return typeof value === 'string'
    //         }

    //         // If value is an object (operators), check for valid MongoDB operators
    //         if (typeof value === 'object' && value !== null) {
    //             return Object.keys(value).every(
    //                 (op) => op.startsWith('$') || op === '_id'
    //             )
    //         }

    //         // For data.* fields, any value is allowed
    //         return true
    //     })
    // } catch (e) {
    //     return false
    // }
}
