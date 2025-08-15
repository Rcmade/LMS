"use client";

import dynamic from "next/dynamic";
import { Suspense, useMemo } from "react";

import "react-quill-new/dist/quill.snow.css";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

export const EditorSuspense = ({ onChange, value }: EditorProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    [],
  );

  return (
    <div className="quill-wrapper dark:bg-gray-900 dark:text-white">
      <ReactQuill theme="snow" value={value} onChange={onChange} />
    </div>
  );
};

export const Editor = ({ onChange, value }: EditorProps) => {
  return (
    <Suspense>
      <EditorSuspense value={value} onChange={onChange} />
    </Suspense>
  );
};
