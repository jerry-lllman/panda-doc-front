import { create } from 'zustand'
import { Editor, Range, Transforms } from 'slate'
import { LinkElement } from '../../../slate-types'
type State = {
  linkModal: {
    visible: boolean
    selection: Range | null
    link: string
  }
}

type Actions = {
  setLinkModal: (linkModal: State['linkModal']) => void
  linkModalConfirm: (editor: Editor, value: string) => void
}

const usePandaEditorStore = create<State & Actions>((set, get) => ({
  linkModal: {
    visible: false,
    selection: null,
    link: '',
  },
  setLinkModal: (linkModal) => set({ linkModal }),
  linkModalConfirm(editor, value) {
    console.log('linkModalConfirm')
    const { linkModal } = get()
    Transforms.select(editor, linkModal.selection!)
    const isCollapsed = Range.isCollapsed(linkModal.selection!)
    const linkConfig: LinkElement = {
      type: 'link',
      url: value,
      children: isCollapsed ? [{ text: value }] : []
    }

    // Editor.addMark(editor, 'link', value)

    if (isCollapsed) {
      Transforms.insertNodes(editor, linkConfig)
    } else {
      Transforms.wrapNodes(editor, linkConfig, { split: true })
      Transforms.collapse(editor, { edge: 'end' })
    }
    set({ linkModal: { ...linkModal, visible: false } })
  }

}))

export default usePandaEditorStore
