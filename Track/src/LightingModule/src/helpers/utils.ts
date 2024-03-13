import { Quaternion, Vector3 } from "@dcl/ecs-math"

export abstract class Utils {
    static getForwardVectorQ(_rotation: Quaternion): Vector3 {
        return Vector3.create(
            2 * (_rotation.x * _rotation.z + _rotation.w * _rotation.y),
            2 * (_rotation.y * _rotation.z - _rotation.w * _rotation.x),
            1 - 2 * (_rotation.x * _rotation.x + _rotation.y * _rotation.y)
        )
    }
    static hasFlag(enumValue: number, flag: number): boolean {
        return (enumValue & flag) === flag
    }
    static getRandomItem<T>(_array: T[]): T | null {
        return _array !== undefined && _array !== null && _array.length > 0 ? _array[Math.floor(Math.random() * _array.length - 0.0001)] : null
    }
    static getSign(number: number): number {
        return number > 0 ? 1 : number < 0 ? -1 : 0
    }
}