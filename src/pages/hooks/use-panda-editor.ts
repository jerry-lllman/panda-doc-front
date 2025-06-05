import { useCallback, useEffect, useMemo, useState } from 'react'
import { useEditor } from '@tiptap/react'

import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

import '@/assets/styles/list-node.less'
import { ExtensionKit } from "../extensions/extension-kit";
import { createCollaborationCaret } from "../extensions";

export const usePandaEditor = (docId: string, userName: string, userAvatar: string) => {
  // Create document and provider inside the hook for better lifecycle management
  const ydoc = useMemo(() => new Y.Doc(), [docId]);
  const provider = useMemo(() => new WebsocketProvider(`ws`, `doc-room?docId=${docId}`, ydoc), [docId, ydoc]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    editable: true,
    onCreate: () => {
      provider.connect()
      provider.on('status', syncDocument)
    },
    onDestroy: () => {
      ydoc.destroy()
      provider.disconnect()
      provider.off('status', syncDocument)
    },
    onBlur: ({ editor: currentEditor }) => {
      const content = currentEditor.getJSON()
      fetch(`/api/documents/${docId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: JSON.stringify(content)
        })
      })
    },
    extensions: [
      ...ExtensionKit(),
      Collaboration.configure({
        document: ydoc,
      }),
      createCollaborationCaret({
        provider,
        userName,
        userAvatar,
      }),
    ],
  }, [docId])


  const syncDocument = useCallback(async ({ status }: { status: string }) => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/documents/${docId}`);
        const res = await response.json();

        const content = JSON.parse(res.data?.content || '');
        editor?.commands.setContent(content);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (editor?.isEmpty && status === 'connected') {
      fetchDocument()
    }

  }, [editor, docId])


  useEffect(() => {
    // Stop editor shortcuts from bubbling up to the document
    const stopShortcuts = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && editor?.isFocused) {
        e.stopPropagation()
      }
    }
    document.addEventListener('keydown', stopShortcuts)
    return () => document.removeEventListener('keydown', stopShortcuts)
  }, [editor])

  return { editor, provider, loading, error }
}