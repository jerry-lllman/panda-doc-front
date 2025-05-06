
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import React from 'react'
import { SelectGroup } from '@radix-ui/react-select'
import { Input } from '@/components/ui/input'
import { Copy } from 'lucide-react'
import copy from 'copy-to-clipboard'
import { toast } from 'sonner'

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


export const CodeBlockComponent = (props: NodeViewProps) => {
  const { node: { attrs: { language: defaultLanguage } }, updateAttributes, extension } = props

  const [searchLanguage, setSearchLanguage] = React.useState<string>('')

  // 添加语言列表缓存
  const allLanguages = React.useMemo(() => {
    const listLanguages: string[] = extension.options.lowlight.listLanguages()
    return languages.filter(item => listLanguages.findIndex(lang => lang === item.value))
  }, [extension.options.lowlight])

  const filteredLanguages = React.useMemo(() => {
    return allLanguages.filter(item => item.label.toLowerCase().includes(searchLanguage.toLowerCase()))
  }, [allLanguages, searchLanguage])

  const copyCode = () => {
    const code = props.node.textContent
    copy(code)
    toast.success('Copy Success', {
      position: 'bottom-center'
    })
  }

  return (
    <NodeViewWrapper className="code-block">
      <div className='flex justify-between items-center'>
        <Select onValueChange={language => updateAttributes({ language })}>
          <SelectTrigger>
            {defaultLanguage}
          </SelectTrigger>
          <SelectContent>
            <Input
              placeholder="Search for a language..."
              onChange={e => {
                const value = e.target.value
                setSearchLanguage(value)
              }}
            />
            <SelectGroup>
              {filteredLanguages.map((language) => (
                <SelectItem key={language.value} value={language.value}>
                  {language.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className='px-2'>
          <Copy className=' cursor-pointer' onClick={copyCode} />
        </div>
      </div>
      <div>
        <pre>
          <NodeViewContent as="code" />
        </pre>
      </div>
    </NodeViewWrapper>
  )
}