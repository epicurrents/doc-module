import DocumentLoader from '#loader/DocumentLoader'
import DocumentService from '#service/DocumentService'
import PaginatedDocument from './PaginatedDocument'
import runtime from './runtime'
import settings from './config'

const modality = 'document'

export {
    DocumentLoader,
    DocumentService,
    PaginatedDocument,
    modality,
    runtime,
    settings,
}