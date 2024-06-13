/**
 * Epicurrents HTM module.
 * @package    epicurrents/htm-module
 * @copyright  2024 Sampsa Lohi
 * @license    Apache-2.0
 */

import { logInvalidMutation } from '@epicurrents/core/dist/runtime'
import {
    type DataResource,
    type RuntimeResourceModule,
    type SafeObject,
    type StateManager,
} from '@epicurrents/core/dist/types'
import { HtmResource } from '#types'

const SCOPE = 'htm-runtime-module'

const HTM: SafeObject & RuntimeResourceModule = {
    __proto__: null,
    moduleName: {
        code: 'htm',
        full: 'HTM document',
        short: 'HTM',
    },
    setPropertyValue (property: string, value: unknown, resource?: DataResource, state?: StateManager) {
        // HTM document specific property mutations.
        const activeRes = resource
                          ? resource as HtmResource
                          : state
                            ? state.APP.activeDataset?.activeResources[0] as HtmResource
                            : null
        if (!activeRes) {
            return
        }
        if (property === 'current-page') {
            if (typeof value !== 'number') {
                logInvalidMutation(property, value, SCOPE)
                return
            }
            if (activeRes.currentPage !== value) {
                activeRes.currentPage = value
            }
        }
    },
}
export default HTM
