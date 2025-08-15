"use client";

// import dynamic from "next/dynamic";
// import { useMemo } from "react";

// import "react-quill-new/dist/quill.snow.css";

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  // // Import Quill w/o server side rendering to prevent hydration errors.
  // const ReactQuill = useMemo(
  //   () =>
  //     dynamic(() => import("react-quill-new"), {
  //       ssr: false,
  //     }),
  //   [],
  // );

  return (
    <div className="">
      {/* <ReactQuill theme="bubble" value={value} readOnly={true} /> */}
      {value}
    </div>
  );
};
