/* imports */

import { TransformConfig } from "./TransformConfig"

/* type definition */

export type SetConfig = TransformConfig & {
    url: string
    volume?: number
    showDJ?: boolean
}