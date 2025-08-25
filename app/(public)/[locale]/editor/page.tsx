"use client";
import TipTap from "@/components/editor/Tiptap";
import { useState } from "react";

export default function Home() {
  const [post, setPost] = useState("");

  const onChange = (content: string) => {
    setPost(content);
    console.log(content);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <TipTap content={post} onChange={onChange} />
    </div>
  );
}
