/* class definition */

import { Quaternion, Vector3 } from "@dcl/sdk/math"

export abstract class Utils {

    /* static methods */

    static coalesce<T>(_value: T, _fallback: T): T {
        if (_value === undefined || _value === null) {
            return _fallback
        }
        return _value
    }

    static multiplyVectorByQuaternion(_quaternion: Quaternion, _vector: Vector3): Vector3 {
        const q = [_quaternion.w, _quaternion.x, _quaternion.y, _quaternion.z]
        const r = [0, _vector.x, _vector.y, _vector.z]
        const conj = [q[0], -1 * q[1], -1 * q[2], -1 * q[3]]
        const mul = (q: number[], r: number[]): number[] => {
            return [
                r[0] * q[0] - r[1] * q[1] - r[2] * q[2] - r[3] * q[3],
                r[0] * q[1] + r[1] * q[0] - r[2] * q[3] + r[3] * q[2],
                r[0] * q[2] + r[1] * q[3] + r[2] * q[0] - r[3] * q[1],
                r[0] * q[3] - r[1] * q[2] + r[2] * q[1] + r[3] * q[0]
            ]
        }
        const res = mul(mul(q, r), conj)
        return Vector3.create(res[1], res[2], res[3])
    }

    static setUVs(_x: number, _y: number, _width: number, _height: number, _face: "FRONT" | "BACK" | "BOTH"): number[] {

        // grab the current uv set, or initialise them
        var uvs = [

            // front
            0, 0,   // bottom left
            1, 0,   // bottom right
            1, 1,   // top right
            0, 1,   // top left

            // back
            1, 0,   // bottom right
            0, 0,   // bottom left
            0, 1,   // top left
            1, 1    // top right
        ]

        // make the changes to one or either face
        if (_face === "FRONT" || _face === "BOTH") {
            uvs[0] = _x
            uvs[1] = _y
            uvs[2] = _x + _width
            uvs[3] = _y
            uvs[4] = _x + _width
            uvs[5] = _y + _height
            uvs[6] = _x
            uvs[7] = _y + _height
        }
        if (_face === "BACK" || _face === "BOTH") {
            uvs[8] = _x + _width
            uvs[9] = _y
            uvs[10] = _x
            uvs[11] = _y
            uvs[12] = _x
            uvs[13] = _y + _height
            uvs[14] = _x + _width
            uvs[15] = _y + _height
        }

        // apply the changes
        return uvs
    }

    static getInverseQuaternion(_q: Quaternion): Quaternion {
        const mag = (_q.x * _q.x) + (_q.y * _q.y) + (_q.z * _q.z) + (_q.w * _q.w)
        if (mag == 0) return Quaternion.Identity()
        
        return Quaternion.create(_q.w / mag, -_q.x / mag, -_q.y / mag, -_q.z / mag)
    }
}