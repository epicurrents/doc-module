/**
 * Epicurrents document.
 * @package    epicurrents/doc-module
 * @copyright  2024 Sampsa Lohi
 * @license    Apache-2.0
 */

import { GenericDocumentResource } from '@epicurrents/core'
import { StudyContext } from '@epicurrents/core/dist/types'
import { type DocumentFormat, type DocResource } from '#types'
//import Log from 'scoped-ts-log'

//const SCOPE = "HtmDocument"
export default class HtmDocument extends GenericDocumentResource implements DocResource {
    protected _worker?: Worker
    /**
     * Create a new HtmDocument.
     */
    constructor (name: string, format: DocumentFormat, source: StudyContext, worker?: Worker, config?: any) {
        super(name, config?.type || 'doc', format, source)
        if (worker) {
            this._worker = worker
        }
    }
}
