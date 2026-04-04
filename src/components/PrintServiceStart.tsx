import React, { useEffect, useRef } from "react";

interface IPrintContainerProps {
    contentRef: React.RefObject<HTMLDivElement | null>;
    onComplete: () => void;
}

const PrintServiceStart: React.FC<IPrintContainerProps> = ({
    contentRef,
    onComplete,
}) => {
    const hasRun = useRef(false);

    useEffect(() => {
        if (!contentRef.current || hasRun.current) return;
        hasRun.current = true;

        // 1. Create a hidden iframe
        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "0";
        document.body.appendChild(iframe);

        // 2. Clone Styles (Crucial for Tailwind)
        const styles = Array.from(
            document.querySelectorAll('style, link[rel="stylesheet"]'),
        )
            .map((style) => style.outerHTML)
            .join("");

        const htmlContent = `
      <html>
        <head>
          <title>POS Z-REPORT</title>
          ${styles}
          <style>
            @media print {
              body { margin: 0; padding: 20px; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          ${contentRef.current.innerHTML}
        </body>
      </html>
        `;

        // 3. Use srcdoc instead of document.write to avoid deprecation warning
        iframe.srcdoc = htmlContent;

        // 4. Trigger Print
        iframe.onload = () => {
            iframe.contentWindow?.focus();
            // Slight timeout to ensure styles/images are parsed in the iframe
            setTimeout(() => {
                iframe.contentWindow?.print();
                // 5. Cleanup
                document.body.removeChild(iframe);
                onComplete();
            }, 500);
        };
    }, [contentRef, onComplete]);

    return null; // This component doesn't render anything to the screen
};

export default PrintServiceStart;
