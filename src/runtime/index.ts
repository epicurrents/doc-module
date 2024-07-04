/**
 * Epicurrents document module.
 * @package    epicurrents/doc-module
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
import { DocResource } from '#types'

const SCOPE = 'doc-runtime-module'

const DOC: SafeObject & RuntimeResourceModule = {
    __proto__: null,
    moduleName: {
        code: 'doc',
        full: 'Document',
        short: 'Doc',
    },
    setPropertyValue (property: string, value: unknown, resource?: DataResource, state?: StateManager) {
        // Document specific property mutations.
        const activeRes = resource
                          ? resource as DocResource
                          : state
                            ? state.APP.activeDataset?.activeResources[0] as DocResource
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
export default DOC
