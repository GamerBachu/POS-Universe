import React, { useState } from "react";
import PrintServiceStart from "./PrintServiceStart";
import Button from "./Button";
import resource from "@/locales/en.json";

interface IPrintContainerProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
  isLoading: boolean;
  className?: string;
  title?: string;
}

const PrintService: React.FC<IPrintContainerProps> = ({
  contentRef,
  title = "",
  isLoading,
  className = "bg-blue-600 hover:bg-blue-700 p-2",
}) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const name = title === "" ? resource.common.print : title;

  return (
    <>
      {isPrinting && (
        <PrintServiceStart
          contentRef={contentRef}
          onComplete={() => setIsPrinting(false)}
        />
      )}
      <Button
        type="button"
        className={className}
        disabled={isPrinting}
        onClick={() => setIsPrinting(true)}
        title={name}
        isLoading={isLoading}
      >
        {name}
      </Button>
    </>
  );
};

export default PrintService;
