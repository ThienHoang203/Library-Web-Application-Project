export function generatePDFURL(data: Blob): string {
    // const blob = new Blob([data], { type: "application/pdf" });
    return URL.createObjectURL(data);
}
