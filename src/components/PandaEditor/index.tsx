import { useEffect, useState } from "react"
import { WebsocketProvider } from "y-websocket"
import * as Y from 'yjs'
import { isNil } from "lodash-es"
import PandaEditorCore from "./core"
import { Descendant } from "slate"

type WebsocketProviderParameters = ConstructorParameters<typeof WebsocketProvider>

interface PandaEditorProps {
  initialValue: Descendant[],
  yWebsocket?: {
    serverUrl: WebsocketProviderParameters[0],
    roomname: WebsocketProviderParameters[1],
    userName: string,
    options?: WebsocketProviderParameters[3]
  }
}

export default function PandaEditor(props: PandaEditorProps) {

  const { yWebsocket, initialValue } = props

  const needSyncDoc = !isNil(yWebsocket?.serverUrl) && !isNil(yWebsocket?.roomname)

  const [connected, setConnected] = useState(false)
  const [sharedType, setSharedType] = useState<Y.XmlText>()
  const [provider, setProvider] = useState<WebsocketProvider>()

  useEffect(() => {
    if (!needSyncDoc) return

    const yDoc = new Y.Doc()
    const yProvider = new WebsocketProvider(yWebsocket.serverUrl, yWebsocket.roomname, yDoc, yWebsocket.options);

    const sharedDoc = yDoc.get('slate', Y.XmlText)

    yProvider.on('sync', setConnected)
    setSharedType(sharedDoc)
    setProvider(yProvider)

    return () => {
      yDoc?.destroy()
      yProvider?.off('sync', setConnected)
      yProvider?.destroy()
    }
  }, [])


  if (needSyncDoc && (!connected || !sharedType || !provider)) {
    return <div>Loading...</div>
  }

  return <PandaEditorCore initialValue={initialValue} needSyncDoc={needSyncDoc} sharedType={sharedType!} provider={provider!} userName={yWebsocket?.userName} />
}