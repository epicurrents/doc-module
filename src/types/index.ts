import { DocumentFormat, DocumentResource } from "@epicurrents/core/dist/types"

export interface HtmDataService {

}

export type HtmDocumentFormat = Exclude<DocumentFormat, "pdf">

export type HtmModuleSettings = {

}

export interface HtmResource extends DocumentResource {

}