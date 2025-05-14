import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import type { NodeViewProps as NodeViewPropsType } from '@tiptap/react'
import { App, Button, Divider, Input, Select } from 'antd'
import React from 'react'
import copy from 'copy-to-clipboard'
import { Copy } from 'lucide-react'
import { TooltipButton } from '@/pages/components'
import { trim } from 'lodash-es'
import { cn } from '@/utils'

const languages = [
  {
    label: 'Plain Text',
    value: 'plaintext',
  },
  {
    label: 'Bash',
    value: 'bash',
  },
  {
    label: 'Basic',
    value: 'basic',
  },
  {
    label: 'C',
    value: 'c',
  },
  {
    label: 'C#',
    value: 'csharp'
  },
  {
    label: 'C++',
    value: 'cpp',
  },
  {
    label: 'CSS',
    value: 'css',
  },
  {
    label: 'Dart',
    value: 'dart',
  },
  {
    label: 'Diff',
    value: 'diff',
  },
  {
    label: 'Dockerfile',
    value: 'dockerfile',
  },
  {
    label: 'Git',
    value: 'git',
  },
  {
    label: 'Go',
    value: 'go',
  },
  {
    label: 'GraphQL',
    value: 'graphql',
  },
  {
    label: 'Haskell',
    value: 'haskell',
  },
  {
    label: 'HTML',
    value: 'html',
  },
  {
    label: 'HTTP',
    value: 'http',
  },
  {
    label: 'Java',
    value: 'java',
  },
  {
    label: 'JavaScript',
    value: 'javascript',
  },
  {
    label: 'JSON',
    value: 'json',
  },
  {
    label: 'JSX',
    value: 'jsx',
  },
  {
    label: 'Julia',
    value: 'julia',
  },
  {
    label: 'Kotlin',
    value: 'kotlin',
  },
  {
    label: 'Less',
    value: 'less',
  },
  {
    label: 'Markdown',
    value: 'markdown',
  },
  {
    label: 'Nginx',
    value: 'nginx',
  },
  {
    label: 'Objective-C',
    value: 'objectivec',
  },
  {
    label: 'PHP',
    value: 'php',
  },
  {
    label: 'PL/SQL',
    value: 'plsql',
  },
  {
    label: 'PowerShell',
    value: 'powershell',
  },
  {
    label: 'Protobuf',
    value: 'protobuf',
  },
  {
    label: 'Python',
    value: 'python',
  },
  {
    label: 'R',
    value: 'r',
  },
  {
    label: 'Ruby',
    value: 'ruby',
  },
  {
    label: 'Rust',
    value: 'rust',
  },
  {
    label: 'Sass',
    value: 'sass',
  },
  {
    label: 'Scala',
    value: 'scala',
  },
  {
    label: 'Scheme',
    value: 'scheme',
  },
  {
    label: 'Shell',
    value: 'shell',
  },
  {
    label: 'Solidity',
    value: 'solidity',
  },
  {
    label: 'SQL',
    value: 'sql',
  },
  {
    label: 'Swift',
    value: 'swift',
  },
  {
    label: 'TOML',
    value: 'toml',
  },
  {
    label: 'TSX',
    value: 'tsx',
  },
  {
    label: 'TypeScript',
    value: 'typescript',
  },
  {
    label: 'Vue',
    value: 'vue',
  },
  {
    label: 'XML',
    value: 'xml',
  },
  {
    label: 'YAML',
    value: 'yaml',
  },
]


export const CodeBlockComponent = (props: NodeViewPropsType) => {
  const { node: { attrs: { language: defaultLanguage, isWrap } }, updateAttributes, extension } = props

  const { message } = App.useApp();

  const [searchLanguage, setSearchLanguage] = React.useState<string>('')

  const onLanguageChange = (value: string) => {
    updateAttributes({ language: value })
    setSearchLanguage('')
  }

  // get enabled languages
  const allLanguages = React.useMemo(() => {
    const listLanguages: string[] = extension.options.lowlight.listLanguages()
    return languages.filter(item => listLanguages.findIndex(lang => lang === item.value))
  }, [extension.options.lowlight])

  const filteredLanguages = React.useMemo(() => {
    const search = trim(searchLanguage)
    if (!search) {
      return allLanguages
    }

    return allLanguages.filter(item => item.label.toLowerCase().includes(search.toLowerCase()))
  }, [allLanguages, searchLanguage])

  const copyCode = () => {
    const code = props.node.textContent
    copy(code)
    message.success('Copied code to clipboard')
  }

  const wrapCode = () => {
    // 将 isWrap 属性设置为 true/false
    updateAttributes({ isWrap: !isWrap })
  }

  return (
    <NodeViewWrapper className="code-block rounded-md border border-gray-200 p-2 my-2">
      <div className='flex justify-between items-center border-b border-gray-200 pb-2' contentEditable='false'>
        <Select
          options={filteredLanguages}
          value={defaultLanguage}
          onChange={onLanguageChange}
          popupMatchSelectWidth={300}
          variant='borderless'
          popupRender={(menu) => (
            <div>
              <div className='p-2'>
                <Input placeholder='Search for a language' value={searchLanguage} onChange={(e) => setSearchLanguage(e.target.value)} />
              </div>
              <Divider style={{ margin: 0 }} />
              {menu}
            </div>
          )}
        />
        <div className='px-2 '>
          <TooltipButton
            className='!p-1'
            tooltip='Copy'
            onClick={copyCode}
          >
            <Copy size={14} />
          </TooltipButton>
          <Button type='link' onClick={wrapCode}>
            {isWrap ? 'Unwrap code' : 'Wrap code'}
          </Button>
        </div>
      </div>
      <div className='px-2'>
        <div className={cn('py-4', !isWrap && 'overflow-x-auto')}>
          <pre>
            <NodeViewContent as="code" style={isWrap ? { whiteSpace: 'break-spaces', wordBreak: 'break-all' } : { whiteSpace: 'pre' }} />
          </pre>
        </div>
      </div>
    </NodeViewWrapper>
  )
}