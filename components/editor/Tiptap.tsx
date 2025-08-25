"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Youtube from "@tiptap/extension-youtube";
import React from "react";
import MenuBar from "./MenuBar";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}
export default function TipTap({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "my-custom-class",
        },
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "min-h-[156px] border rounded-md bg-slate-50 dark:bg-slate-300 text-black py-2 px-3",
      },
    },
    onUpdate: ({ editor }) => {
      // console.log(editor.getHTML());
      onChange(editor.getHTML());
    },
  });

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
