import type { DocumentResource } from "@epicurrents/core/dist/types"

export interface DocumentDataService {

}

/**
 * Valid document formats.
 */
export type DocumentFormat = "html" | "markdown" | "pdf"

export type DocumentModuleSettings = {

}

export interface PaginatedDocumentResource extends DocumentResource {
    /** Promise that resolves with the content of the current page. */
    content: Promise<string>
    /** Current page number of the document, starting from 1. */
    currentPage: number
    /** Total number of pages in the document. */
    numPages: number
    /**
     * Get the document object.
     * @returns Document object (depends on source format).
     */
    getDocument(): Promise<unknown>
    /**
     * Get the page object for the given page number.
     * @param pageNum - Page number (1-based, default current page).
     * @returns Page object (depends on source format).
     */
    getPage(pageNum?: number): Promise<unknown>
    /**
     * Get the text content of the page for the given page number.
     * @param pageNum - Page number (1-based, default current page).
     * @returns Text content of the page.
     */
    getPageText(pageNum?: number): Promise<string>
    /** Increase page number by one, if there is a following page. */
    nextPage (): void
    /** Reduce page number by one, if there is a preceding page. */
    prevPage (): void
}