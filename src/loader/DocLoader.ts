/**
 * Epicurrents document loader.
 * @package    epicurrents/doc-module
 * @copyright  2024 Sampsa Lohi
 * @license    Apache-2.0
 */

import { GenericStudyLoader } from '@epicurrents/core'
import {
    type ConfigStudyLoader,
    type FileFormatReader,
    type FileSystemItem,
    type StudyContext,
} from '@epicurrents/core/dist/types'
import { HtmDocument } from '..'
import { type DocumentFormat, type DocResource } from '#types'
import Log from 'scoped-ts-log'

const SCOPE = 'DocLoader'

export default class DocLoader extends GenericStudyLoader {

    constructor (name: string, contexts: string[], types: string[], reader: FileFormatReader) {
        super(name, contexts, types, reader)
    }

    get resourceScope () {
        return HtmDocument.SCOPES.DOCUMENT
    }

    async getResource (idx: number | string = -1): Promise<DocResource | null> {
        const loaded = await super.getResource(idx)
        if (loaded) {
            return loaded as DocResource
        } else if (!this._study) {
            return null
        }
        // Create a new resource from the loaded study.
        if (!this._study.name) {
            Log.error(
                `Cannot construct a document resource from given study context; it is missing required properties.`,
            SCOPE)
            return null
        }
        const worker = this._fileReader?.getFileTypeWorker()
        if (!worker) {
            Log.error(`Study loader does not have a file worker.`, SCOPE)
            return null
        }
        if (!worker) {
            Log.error(`Study loader doesn't have a file type loader.`, SCOPE)
            return null
        }
        const doc = new HtmDocument(
            this._study.name,
            this._study.format as DocumentFormat,
            this._study,
            worker,
        )
        doc.state = 'loaded'
        doc.source = this._study
        this._resources.push(doc)
        // Clear the loaded study.
        this._study = null
        return doc
    }

    public async loadFromDirectory (dir: FileSystemItem, config?: ConfigStudyLoader): Promise<StudyContext|null> {
        const context = await super.loadFromDirectory(dir, config)
        if (!context) {
            return null
        }
        context.type = 'doc'
        return context
    }

    public async loadFromUrl (
        fileUrl: string,
        config?: ConfigStudyLoader,
        preStudy?: StudyContext | undefined
    ): Promise<StudyContext | null> {
        const context = await super.loadFromUrl(fileUrl, config, preStudy)
        if (!context) {
            return null
        }
        context.type = 'doc'
        return context
    }
}
