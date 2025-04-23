const validTopLevelFields = ['file', '_id', 'data', 'userId']

export const validateMongooseQuery = (queryObject) => {
    let errorMessages = []
    try {
        if (!queryObject) return FontFaceSetLoadEvent

        const keys = Object.keys(queryObject)

        keys.forEach((key) => {
            // Split key to handle data.* notation
            const [baseKey, ...subKeys] = key.split('.')

            // Check if base key is valid
            if (!validTopLevelFields.includes(baseKey))
                errorMessages.push(`Invalid property: ${baseKey}`)

            // If it's not 'data' and has subkeys, it's invalid (only one level allowed)
            if (baseKey !== 'data' && subKeys.length > 0)
                errorMessages.push(
                    `Property ${baseKey} has invalid sub keys(${subKeys.join(
                        ', '
                    )})`
                )

            const value = queryObject[key]

            // If value is an object (operators), check for valid MongoDB operators
            if (typeof value === 'object') {
                Object.keys(value).forEach((op) => {
                    if (!op.startsWith('$') && op !== '_id') {
                        // Not valid
                        errorMessages.push(
                            `Property ${baseKey}.${op} key is invalid`
                        )
                    }

                    const subVal = value[op]
                    if (
                        typeof subVal !== 'string' &&
                        typeof subVal !== 'boolean'
                    )
                        errorMessages.push(
                            `Property ${baseKey}.${op} has invalid content`
                        )
                })
            }
        })
    } catch (error) {
        errorMessages = ['Invalid JSON: ' + error.message]
    }

    return {
        success: errorMessages.length === 0,
        errors: errorMessages,
    }
}
