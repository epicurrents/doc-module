/**
 * Epicurrents document service.
 * @package    epicurrents/doc-module
 * @copyright  2024 Sampsa Lohi
 * @license    Apache-2.0
 */

import { GenericService } from '@epicurrents/core'
import type { StudyContext, WorkerResponse } from '@epicurrents/core/dist/types'
import type { DocumentDataService, SetupDocumentWorkerResponse } from '#types'
import { Log } from 'scoped-event-log'

const SCOPE = "DocumentService"

export default class DocumentService extends GenericService implements DocumentDataService {

    get worker () {
        return this._worker
    }

    constructor (worker: Worker) {
        super (DocumentService.CONTEXTS.DOCUMENT, worker)
        this._worker?.addEventListener('message', this.handleMessage.bind(this))
    }

    async getContent (pageNum?: number) {
        const commission = this._commissionWorker(
            'get-page-content',
            new Map([
                ['pageNum', pageNum]
            ])
        )
        return commission.promise as Promise<string>
    }

    async getDocument () {
        const commission = this._commissionWorker('get-document')
        return commission.promise as Promise<unknown>
    }

    async getPage (pageNum: number) {
        const commission = this._commissionWorker(
            'get-page',
            new Map([
                ['pageNum', pageNum]
            ])
        )
        return commission.promise as Promise<unknown>
    }

    async handleMessage (message: WorkerResponse) {
        const data = message.data
        if (!data) {
            return false
        }
        // Responses must have a matching commission.
        const commission = this._getCommissionForMessage(message)
        if (!commission) {
            return false
        }
        if (data.action === 'get-document') {
            if (data.success) {
                commission.resolve(data.document)
            } else {
                Log.error(`Loading document failed.`, SCOPE)
                commission.resolve(null)
            }
            return true
        } else if (data.action === 'get-page') {
            if (data.success) {
                commission.resolve(data.page)
            } else {
                Log.error(`Loading page failed.`, SCOPE)
                commission.resolve(null)
            }
            return true
        } else if (data.action === 'get-page-content') {
            if (data.success) {
                commission.resolve(data.content)
            } else {
                Log.error(`Loading page content failed.`, SCOPE)
                commission.resolve('')
            }
            return true
        } else if (data.action === 'set-sources') {
            if (data.success) {
                commission.resolve({ numPages: data.numPages })
            } else {
                Log.error(`Setting sources failed.`, SCOPE)
                commission.resolve({ numPages: 0 })
            }
            return true

        }
        return false
    }

    async prepareWorker (study: StudyContext) {
        // Find the data files; there should be one for each page of the document.
        const items = study.files.filter(f => f.role === 'data').map(item => {
            return {
                file: item.file,
                page: item.range[0],
                url: item.url,
            }
        })
        const commission = this._commissionWorker(
            'set-sources',
            new Map([
                ['sources', items],
            ])
        )
        return commission.promise as Promise<SetupDocumentWorkerResponse>
    }
}