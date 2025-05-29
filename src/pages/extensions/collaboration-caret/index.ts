import CollaborationCaret from '@tiptap/extension-collaboration-caret'
import { WebsocketProvider } from 'y-websocket'

const USER_COLORS = [
  "#1a1c2c",
  "#5d275d",
  "#b13e53",
  "#ef7d57",
  "#ffcd75",
  "#a7f070",
  "#38b764",
  "#257179",
  "#29366f",
  "#3b5dc9",
  "#41a6f6",
  "#73eff7",
  "#f4f4f4",
  "#94b0c2",
  "#566c86",
  "#333c57"
];

export interface CollaborationCaretOptions {
  provider: WebsocketProvider
  userName: string
  userAvatar: string
}

export const createCollaborationCaret = ({ provider, userName, userAvatar }: CollaborationCaretOptions) => {
  return CollaborationCaret.configure({
    provider,
    user: {
      name: userName,
      color: USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)],
      avatar: userAvatar,
    },
    render: user => {
      const cursor = document.createElement('span')
      cursor.classList.add('collaboration-cursor')
      cursor.setAttribute('style', `border-color: ${user.color}`)

      const label = document.createElement('div')
      label.classList.add('collaboration-label')
      label.setAttribute('style', `background-color: ${user.color}`)

      if (user.avatar) {
        const avatar = document.createElement('img')
        avatar.classList.add('collaboration-avatar')
        avatar.src = user.avatar
        label.appendChild(avatar)
      }

      const name = document.createElement('span')
      name.textContent = user.name

      label.appendChild(name)
      cursor.appendChild(label)
      return cursor
    },
    selectionRender: user => {
      return {
        nodeName: 'span',
        class: 'collaboration-selection',
        style: `background-color: ${user.color}40;`,
        'data-user': user.name,
      }
    }
  })
} 