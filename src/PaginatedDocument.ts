/**
 * Epicurrents document.
 * @package    epicurrents/doc-module
 * @copyright  2024 Sampsa Lohi
 * @license    Apache-2.0
 */

import { GenericDocumentResource } from '@epicurrents/core'
import type { StudyContext } from '@epicurrents/core/dist/types'
import DocumentService from '#service/DocumentService'
import type { DocumentFormat, PaginatedDocumentResource } from '#types'
//import Log from 'scoped-event-log'

//const SCOPE = "PaginatedDocument"
/**
 * Paginated document resource. This class exposes methods for accessing generic document properties. The actual data
 * returned by these methods may vary depending on the document type.
 */
export default class PaginatedDocument extends GenericDocumentResource implements PaginatedDocumentResource {
    /** List of supported document modalities (types). */
    static MODALITIES = {
        HTM: 'htm',
        PDF: 'pdf',
    }
    protected _currentPage = 1
    protected _numPages = 0
    protected _service: DocumentService
    protected _worker?: Worker
    /**
     * Create a new MultiDocument.
     * @param name - Document name; this will be displayed in the UI.
     * @param type - Document type; must be one of the valid types.
     * @param format - Format of the document source.
     * @param source - Document source as a study context.
     * @param worker - Worker for the document service; must be appropriate to the document format.
     */
    constructor (name: string, type: string, format: DocumentFormat, source: StudyContext, worker: Worker) {
        super(name, type, format, source)
        this._service = new DocumentService(worker)
        this._state = 'loading'
        this._service.prepareWorker(source).then((response) => {
            if (response.numPages) {
                this._numPages = response.numPages
                this._state = 'ready'
            } else {
                this._errorReason = 'Document has no pages'
                this._state = 'error'
            }
        })
    }

    get content (): Promise<string> {
        return this._service.getContent(this._numPages > 1 ? this._currentPage : undefined)
    }

    get currentPage () {
        return this._currentPage
    }
    set currentPage (value: number) {
        this._setPropertyValue('currentPage', value)
    }

    get numPages () {
        return this._numPages
    }
    set numPages (value: number) {
        this._setPropertyValue('numPages', value)
    }

    getDocument (): Promise<unknown> {
        return this._service.getDocument()
    }

    getMainProperties () {
        const props = super.getMainProperties()
        if (!this.numPages) {
            props.set('Not loaded yet', null)
        } else if (this.numPages < 2) {
            props.set('Single page', null)
        } else {
            props.set(
                this.numPages.toString(),
                {
                    text: '{n} pages',
                    title: 'Document has a total of {n} pages',
                    n: this.numPages
                }
            )
        }
        return props
    }

    getPage (pageNum = this._currentPage): Promise<unknown> {
        return this._service.getPage(pageNum)
    }

    getPageText (pageNum = this._currentPage): Promise<string> {
        return this._service.getContent(pageNum)
    }

    nextPage () {
        if (this._numPages > this._currentPage) {
            this.currentPage = this.currentPage + 1
        }
    }

    prevPage () {
        if (this._currentPage > 1) {
            this.currentPage = this.currentPage - 1
        }
    }
}
