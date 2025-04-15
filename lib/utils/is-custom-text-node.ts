import { Editor } from "@tiptap/react";
import { Link } from "@/app/(authenticated)/[user_space]/[resource_id]/extensions"

const CUSTOM_NODES = [Link.name]

export const isCustomTextNode = (editor: Editor) => {

  return CUSTOM_NODES.some(type => editor.isActive(type))
}