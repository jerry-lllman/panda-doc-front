
import { StarterKit } from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import { TaskList, TaskItem } from "@tiptap/extension-list";
import { TextStyle } from "@tiptap/extension-text-style";

import {
  CodeBlock,
  Color,
  Emoji,
  emojiSuggestion,
  HorizontalRule,
  linkConfig,
  ResetMarksOnEnter,
  Selection,
  SlashCommand
} from '.'

export const ExtensionKit = () => [
  StarterKit.configure({
    horizontalRule: false,
    codeBlock: false,
    paragraph: { HTMLAttributes: { class: 'text-node' } },
    heading: { HTMLAttributes: { class: 'heading-node' } },
    blockquote: { HTMLAttributes: { class: 'block-node' } },
    bulletList: { HTMLAttributes: { class: 'list-node' } },
    orderedList: { HTMLAttributes: { class: 'list-node' } },
    code: { HTMLAttributes: { class: 'inline inline-code', spellcheck: 'false' } },
    dropcursor: { width: 2, class: 'ProseMirror-dropcursor border' },
    link: linkConfig
  }),
  CodeBlock,
  Highlight.configure({ multicolor: true }),
  Selection,
  TextStyle,
  TaskList,
  TaskItem.configure({ nested: true }),
  Color,
  ResetMarksOnEnter,
  HorizontalRule,
  SlashCommand,
  Emoji.configure({
    enableEmoticons: true,
    suggestion: emojiSuggestion,
  }),
]