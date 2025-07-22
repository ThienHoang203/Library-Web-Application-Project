import React, { forwardRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";
import bookPDF from "/CSE310_BookManagementSystem_TranTrungHau_HoangCongThien_NguyenDucTien-1748367223385-791781837.pdf";
import { useReadingProgress } from "../hooks/useReadingProgress";
import { useCurrentRoute } from "../hooks/useCurrentRoute";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

type PagePDFProps = {
    pageNumber: number;
    children?: React.ReactNode;
};

const PagePDF = forwardRef<HTMLDivElement, PagePDFProps>((props, ref) => {
    return (
        <div className="demoPage flex flex-col justify-center items-" ref={ref}>
            <Page
                scale={0.9}
                renderMode="canvas"
                className={"w-full"}
                renderTextLayer={false}
                pageNumber={props.pageNumber}
            />
        </div>
    );
});

PagePDF.displayName = "PagePDF";

export default function PDFViewer() {
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const { state } = useCurrentRoute();
    console.log(state?.bookId);

    const { lastPage, save } = useReadingProgress(state?.bookId);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    function handleUpdateLastPage({ data }: any) {
        console.log(data);

        save(data + 1);
    }

    return (
        <div className="h-screen w-screen mt-5 flex justify-center items-start bg-gray-200">
            <Document file={bookPDF} onLoadSuccess={onDocumentLoadSuccess}>
                <HTMLFlipBook
                    width={600}
                    height={1000}
                    className={""}
                    style={{}}
                    startPage={lastPage - 1}
                    size={"fixed"}
                    minWidth={0}
                    maxWidth={0}
                    minHeight={0}
                    maxHeight={0}
                    drawShadow={false}
                    flippingTime={1000}
                    usePortrait={false}
                    startZIndex={0}
                    autoSize={false}
                    maxShadowOpacity={0.5}
                    showCover={true}
                    mobileScrollSupport={false}
                    clickEventForward={false}
                    useMouseEvents={true}
                    swipeDistance={30}
                    showPageCorners={false}
                    disableFlipByClick={false}
                    onFlip={handleUpdateLastPage}
                >
                    {[...Array(numPages).keys()].map((page) => (
                        <PagePDF key={page} pageNumber={page + 1} />
                    ))}
                </HTMLFlipBook>
            </Document>
        </div>
    );
}
