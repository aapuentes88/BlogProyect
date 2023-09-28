import * as bcryptjs from 'bcryptjs'

export function hashPassword(rawPassword: string) {
    const SALT = bcryptjs.genSaltSync()
    return bcryptjs.hashSync(rawPassword, SALT)
}

export function cmpPassword(rawPassword: string, hash: string) {
    return bcryptjs.compareSync(rawPassword, hash)
}