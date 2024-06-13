/**
 * Epicurrents HTM document.
 * @package    epicurrents/htm-module
 * @copyright  2024 Sampsa Lohi
 * @license    Apache-2.0
 */

import { GenericDocumentResource } from '@epicurrents/core'
import { StudyContext } from '@epicurrents/core/dist/types'
import { type HtmDocumentFormat, type HtmResource } from '#types'
import Log from 'scoped-ts-log'

const SCOPE = "HtmDocument"
export default class HtmDocument extends GenericDocumentResource implements HtmResource {
    protected _worker?: Worker
    /**
     * Create a new HtmRecording.
     */
    constructor (name: string, format: HtmDocumentFormat, source: StudyContext, worker?: Worker, config?: any) {
        super(name, config?.type || 'htm', format, source)
        if (worker) {
            this._worker = worker
        }
    }
}
