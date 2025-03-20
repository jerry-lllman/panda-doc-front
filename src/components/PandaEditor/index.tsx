import { useEffect, useState } from "react"
import { WebsocketProvider } from "y-websocket"
import * as Y from 'yjs'
import { isNil } from "lodash-es"
import PandaEditorCore, { PandaEditorCoreConfig } from "./core"
import { Descendant } from "slate"
// import { getGlobalEditor } from "./util"



type WebsocketProviderParameters = ConstructorParameters<typeof WebsocketProvider>

interface PandaEditorConfig extends PandaEditorCoreConfig {
  yWebsocket?: {
    serverUrl: WebsocketProviderParameters[0],
    roomName: WebsocketProviderParameters[1],
    userName: string,
    options?: WebsocketProviderParameters[3]
  }
}
interface PandaEditorProps {
  initialValue: Descendant[],
  config?: PandaEditorConfig
}

export default function PandaEditor(props: PandaEditorProps) {

  const { config = {}, initialValue } = props

  const { yWebsocket } = config

  const needSyncDoc = !isNil(yWebsocket?.serverUrl) && !isNil(yWebsocket?.roomName)

  const [connected, setConnected] = useState(false)
  const [sharedType, setSharedType] = useState<Y.XmlText>()
  const [provider, setProvider] = useState<WebsocketProvider>()

  useEffect(() => {
    if (!needSyncDoc) return

    const yDoc = new Y.Doc()
    const yProvider = new WebsocketProvider(yWebsocket.serverUrl, yWebsocket.roomName, yDoc, yWebsocket.options);

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

  return (
    <PandaEditorCore
      initialValue={initialValue}
      needSyncDoc={needSyncDoc}
      sharedType={sharedType!}
      provider={provider!}
      userName={yWebsocket?.userName}
      config={config}
    />
  )
}
