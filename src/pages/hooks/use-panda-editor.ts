import { useEffect, useMemo, useState } from 'react'
import { useEditor } from '@tiptap/react'

import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

import '@/assets/styles/list-node.less'
import { ExtensionKit } from "../extensions/extension-kit";
import { createCollaborationCaret } from "../extensions";

export const usePandaEditor = (docId: string, userName: string, userAvatar: string) => {
  // Create document and provider inside the hook for better lifecycle management
  const ydoc = useMemo(() => new Y.Doc(), []);
  const provider = useMemo(() => new WebsocketProvider(`api/ws`, `/doc-room?docId=${docId}`, ydoc), [docId, ydoc]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [documentData, setDocumentData] = useState<Document | null>(null);

  const editor = useEditor({
    editable: true,
    onCreate: ({ editor: currentEditor }) => {

      const fetchDocument = async () => {
        try {
          if (!docId) return

          const response = await fetch(`/api/documents/${docId}`);
          const res = await response.json();

          const content = JSON.parse(res.data?.content || '');
          currentEditor.commands.setContent(content);

        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setLoading(false);
        }
      };
      fetchDocument()

      provider.on('sync', () => {
        if (currentEditor.isEmpty) {
          currentEditor.commands.setContent('')
        }
      })
    },
    onSelectionUpdate: ({ editor: currentEditor }) => {
      fetch(`/api/documents/${docId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: JSON.stringify(currentEditor.getJSON())
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

  // Handle WebSocket connection lifecycle
  useEffect(() => {
    // Connect to the collaboration room
    provider.connect()

    // Log connection status changes
    provider.on('status', (event: { status: string }) => {
      console.log('Collaboration connection status:', event.status)
    })

    return () => {
      // Clean up WebSocket connection when component unmounts
      provider.disconnect()
    }
  }, [provider])

  return { editor, provider, loading, error }
}