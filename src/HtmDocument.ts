/**
 * Epicurrents document.
 * @package    epicurrents/doc-module
 * @copyright  2024 Sampsa Lohi
 * @license    Apache-2.0
 */

import { GenericDocumentResource } from '@epicurrents/core'
import { StudyContext } from '@epicurrents/core/dist/types'
import DocService from '#service/DocService'
import { type DocumentFormat, type DocResource } from '#types'
//import Log from 'scoped-event-log'

//const SCOPE = "HtmDocument"
export default class HtmDocument extends GenericDocumentResource implements DocResource {
    protected _service: DocService
    protected _worker?: Worker
    /**
     * Create a new HtmDocument.
     */
    constructor (name: string, format: DocumentFormat, source: StudyContext, worker: Worker, config?: any) {
        super(name, config?.type || 'doc', format || 'html', source)
        this._service = new DocService(worker)
        this._service.prepareWorker(source)
    }

    get content (): Promise<string> {
        return this._service.getContent()
    }

    getMainProperties () {
        const props = super.getMainProperties()
        if (this.numPages < 2) {
            props.set('Single page', null)
        } else {
            props.set(
                this.numPages.toString(),
                {
                    title: '{n} pages',
                    n: this.numPages
                }
            )
        }
        return props
    }
}
