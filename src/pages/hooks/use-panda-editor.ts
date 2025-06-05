import { useEffect, useMemo, useState, useRef } from 'react'
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
  const cleanupRef = useRef<(() => void) | null>(null);

  const editor = useEditor({
    editable: true,
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

  // Handle document fetching and editor setup when docId or editor changes
  useEffect(() => {
    if (!editor || !docId) return;

    const fetchDocument = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/documents/${docId}`);
        const res = await response.json();

        const content = JSON.parse(res.data?.content || '');
        editor.commands.setContent(content);

        provider.connect()

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();

    // Set up provider sync listener
    const handleSync = () => {
      if (editor.isEmpty) {
        editor.commands.setContent('')
      }
    };

    provider.on('sync', handleSync);

    // Cleanup function for this effect
    return () => {
      provider.off('sync', handleSync);
      provider.disconnect()
    };
  }, [editor, docId, provider]);

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
  // useEffect(() => {
  //   // Connect to the collaboration room
  //   provider.connect()

  //   // Log connection status changes
  //   provider.on('status', (event: { status: string }) => {
  //     console.log('Collaboration connection status:', event.status)
  //   })

  //   // Store cleanup function
  //   cleanupRef.current = () => {
  //     provider.disconnect()
  //   }

  //   return () => {
  //     // Clean up WebSocket connection when component unmounts
  //     cleanupRef.current?.()
  //   }
  // }, [provider])

  // Clean up editor and resources when component unmounts or docId changes
  useEffect(() => {
    return () => {
      // Clean up in the correct order: first disconnect, then destroy
      cleanupRef.current?.()

      if (editor) {
        // Use setTimeout to ensure DOM operations complete before destruction
        setTimeout(() => {
          if (editor && !editor.isDestroyed) {
            editor.destroy()
          }
        }, 0)
      }

      // Clean up Y.js document
      if (ydoc) {
        ydoc.destroy()
      }
    }
  }, [docId, editor, ydoc])

  return { editor, provider, loading, error }
}