import Link, { LinkOptions } from '@tiptap/extension-link'
import { DOMOutputSpec } from '@tiptap/pm/model'
import { HTMLAttributes } from 'react'

// 自定义 Link 扩展
const CustomLink = Link.extend<LinkOptions & { renderHTML: (props: { HTMLAttributes: HTMLAttributes<HTMLAnchorElement> }) => DOMOutputSpec }>({
  renderHTML({ HTMLAttributes }) {
    return [
      'a',
      HTMLAttributes,
      ['span', { class: 'link-content' }, 0] // 0 表示子元素位置
    ]
  },
  parseHTML() {
    return [
      {
        tag: 'a[href]',
        getAttrs: (dom) => {
          if (typeof dom === 'string') return null
          return {
            href: dom.getAttribute('href'),
            target: dom.getAttribute('target'),
            rel: dom.getAttribute('rel')
          }
        }
      }
    ]
  },
  addAttributes() {
    return {
      href: {
        default: null,
        parseHTML: element => element.getAttribute('href'),
        renderHTML: attributes => ({ href: attributes.href })
      },
      target: {
        default: '_blank',
        parseHTML: element => element.getAttribute('target'),
        renderHTML: attributes => ({ target: attributes.target })
      },
      rel: {
        default: 'noopener noreferrer nofollow',
        parseHTML: element => element.getAttribute('rel'),
        renderHTML: attributes => ({ rel: attributes.rel })
      }
    }
  }
}).configure({
  openOnClick: true,
  autolink: true,
  defaultProtocol: 'https',
  protocols: ['http', 'https'],
  isAllowedUri: (url, ctx) => {
    try {
      const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)
      if (!ctx.defaultValidate(parsedUrl.href)) return false

      const allowedProtocols = ctx.protocols.map(p => typeof p === 'string' ? p : p.scheme)
      const protocol = parsedUrl.protocol.replace(':', '')

      return !['ftp', 'file', 'mailto'].includes(protocol) &&
        allowedProtocols.includes(protocol) &&
        !['example-phishing.com'].includes(parsedUrl.hostname)
    } catch {
      return false
    }
  },
  shouldAutoLink: url => {
    try {
      const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)
      return !['example-no-autolink.com'].includes(parsedUrl.hostname)
    } catch {
      return false
    }
  }
})

export default CustomLink
