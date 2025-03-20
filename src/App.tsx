import { Descendant } from "slate"
import PandaEditor from "./components/PandaEditor"
// import { useSearchParams } from "react-router"

const defaultInitialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph' }]
  }
]

export default function App() {

  // const [searchParams] = useSearchParams()

  const searchParams = new URLSearchParams(location.search)

  const docId = searchParams.get('docId') || ''
  const userId = searchParams.get('userId') || ''

  // const editor = useEditor()

  return (
    <div>
      <CollaborativeEditor docId={docId} userId={userId} />
    </div>
  )
}

interface CollaborativeEditorProps {
  docId: string
  userId: string
}

const CollaborativeEditor = (props: CollaborativeEditorProps) => {

  const { docId, userId } = props
  return (
    <PandaEditor
      initialValue={defaultInitialValue}
      config={{
        yWebsocket: {
          serverUrl: 'ws',
          roomName: `doc-room?docId=${docId}&userId=${userId}`,
          userName: userId,
        }
      }}
    />
  )
}
