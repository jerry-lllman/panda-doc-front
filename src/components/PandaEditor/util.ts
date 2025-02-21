import { CursorEditor, withCursors, withYjs, YjsEditor } from "@slate-yjs/core"
import { Editor } from "slate"
import type { WebsocketProvider } from "y-websocket"
import * as Y from 'yjs'

const nativeFn = {
  withYjs,
  withCursors,
}

const customFn: typeof nativeFn = {
  withYjs: <T extends Editor>(editor: Editor, _sharedRoot: Y.XmlText) => editor as T & YjsEditor,
  withCursors: <TCursorData extends Record<string, unknown>, TEditor extends YjsEditor>(
    editor: TEditor,
    _awareness: WebsocketProvider['awareness'],
    _options?: {
      cursorStateField?: string,
      cursorDataField?: string,
      autoSend?: boolean,
      data?: TCursorData
    }
  ) => editor as TEditor & CursorEditor<TCursorData>
}

export function getPandaEditorFns(needSyncDoc: boolean) {
  if (needSyncDoc) {
    return nativeFn
  }
  return customFn
}