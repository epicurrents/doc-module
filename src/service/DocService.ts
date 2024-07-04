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

//const SCOPE = "DocService"

export default class DocService extends GenericService implements DocDataService {

    get worker () {
        return this._worker
    }

    constructor (worker: Worker) {
        super (DocService.SCOPES.DOCUMENT, worker)
        this._worker?.addEventListener('message', this.handleMessage.bind(this))
    }

    async handleMessage (message: WorkerResponse) {
        const data = message.data
        if (!data) {
            return false
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
            'setup-study',
            new Map<string, unknown>([
                ['format', study.format],
                ['items', items],
            ])
        )
        return commission.promise as Promise<SetupWorkerResponse>
    }
}