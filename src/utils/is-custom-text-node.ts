import { Editor } from "@tiptap/react";
import { Link } from "@/pages/extensions"

const CUSTOM_NODES = [Link.name]

export const isCustomTextNode = (editor: Editor) => {

  return CUSTOM_NODES.some(type => editor.isActive(type))
}