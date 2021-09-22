
/**
 *
 *
 * @export
 * @param {*} req
 * @param {*} res
 * @param {*} data
 * @param {*} status
 */
export function success (res, data, status) {
    res.status(status || 200).send({
        data: data
    })
}

/**
 *
 *
 * @export
 * @param {*} req
 * @param {*} res
 * @param {*} message
 * @param {*} status
 * @param {*} details
 */
export function errorResponse (req, res, message, status, details) {
    console.log(details)
    res.status(status || 500).send({
        error: message,
        data: ''
    })
}