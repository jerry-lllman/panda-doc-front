import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import type { NodeViewProps as NodeViewPropsType } from '@tiptap/react'
import { Divider, Dropdown, Input, Space, message, theme } from 'antd'
import React from 'react'
import { CopyOutlined } from '@ant-design/icons'
import copy from 'copy-to-clipboard'
import { ChevronDown } from 'lucide-react'

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
  const { node: { attrs: { language: defaultLanguage } }, updateAttributes, extension } = props

  const [searchLanguage, setSearchLanguage] = React.useState<string>('')

  // 添加语言列表缓存
  const allLanguages = React.useMemo(() => {
    const listLanguages: string[] = extension.options.lowlight.listLanguages()
    return languages.filter(item => listLanguages.findIndex(lang => lang === item.value))
  }, [extension.options.lowlight])

  const filteredLanguages = React.useMemo(() => {
    return allLanguages.filter(item => item.label.toLowerCase().includes(searchLanguage.toLowerCase())).map(item => ({
      key: item.value,
      label: item.label,
      onClick: () => {
        updateAttributes({ language: item.value })
        // editor.commands.focus()
      }
    }))
  }, [allLanguages, searchLanguage, updateAttributes])

  const copyCode = () => {
    const code = props.node.textContent
    copy(code)
    message.success('Copy Success')
  }


  const { token } = theme.useToken()

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  return (
    <NodeViewWrapper className="code-block rounded-md border border-gray-200 p-2 my-2">
      <div className='flex justify-between items-center border-b border-gray-200 pb-2' contentEditable='false'>
        <Dropdown
          trigger={['click']}
          menu={{ items: filteredLanguages }}

          popupRender={(menu) => (
            <div style={contentStyle}>
              <div className='p-2'>
                <Input placeholder='Search Language' onChange={(e) => setSearchLanguage(e.target.value)} />
              </div>
              <Divider style={{ margin: 0 }} />
              {React.cloneElement(
                menu as React.ReactElement<{
                  style: React.CSSProperties;
                }>,
                { style: { boxShadow: 'none', maxHeight: 520, overflow: 'auto' } },
              )}
            </div>
          )}
        >
          <Space size="small" className='cursor-pointer text-gray-500 hover:bg-gray-200 duration-300 rounded-md px-2'>
            {defaultLanguage}
            <ChevronDown size={14} />
          </Space>
        </Dropdown>
        <div className='px-2'>
          <CopyOutlined className=' cursor-pointer' onClick={copyCode} />
        </div>
      </div>
      <div className='p-2'>
        <pre>
          <NodeViewContent as="code" />
        </pre>
      </div>
    </NodeViewWrapper>
  )
}