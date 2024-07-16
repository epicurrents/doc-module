/**
 * Epicurrents document service.
 * @package    epicurrents/doc-module
 * @copyright  2024 Sampsa Lohi
 * @license    Apache-2.0
 */

import { GenericService } from '@epicurrents/core'
import { type StudyContext, type WorkerResponse } from '@epicurrents/core/dist/types'
import { type SetupWorkerResponse } from '@epicurrents/core/dist/types/service'
import { type DocDataService } from '#types'
import { Log } from 'scoped-ts-log'

const SCOPE = "DocService"

export default class DocService extends GenericService implements DocDataService {

    get worker () {
        return this._worker
    }

    constructor (worker: Worker) {
        super (DocService.SCOPES.DOCUMENT, worker)
        this._worker?.addEventListener('message', this.handleMessage.bind(this))
    }

    async getContent (pageNum?: number) {
        const commission = this._commissionWorker(
            'get-page-content',
            new Map([
                ['page-num', pageNum]
            ])
        )
        return commission.promise as Promise<string>
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
        if (data.action === 'get-page-content') {
            if (data.success) {
                commission.resolve(data.content)
            } else {
                Log.error(`Loading page content failed.`, SCOPE)
                commission.resolve('')
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
        return commission.promise as Promise<SetupWorkerResponse>
    }
}