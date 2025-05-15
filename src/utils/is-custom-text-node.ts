import { Editor } from "@tiptap/react";

const CUSTOM_NODES = ['link']

export const isCustomTextNode = (editor: Editor) => {

  return CUSTOM_NODES.some(type => editor.isActive(type))
}