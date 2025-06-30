import { forwardRef, useImperativeHandle } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  theme?: string;
  readOnly?: boolean;
}

export interface CodeEditorRef {
  getValue: () => string;
  setValue: (value: string) => void;
  focus: () => void;
}

export const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(({
  value,
  onChange,
  language = 'javascript',
  height = '300px',
  theme = 'vs-dark',
  readOnly = false
}, ref) => {
  let editorRef: any = null;

  useImperativeHandle(ref, () => ({
    getValue: () => editorRef?.getValue() || '',
    setValue: (newValue: string) => editorRef?.setValue(newValue),
    focus: () => editorRef?.focus()
  }));

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef = editor;
    
    // Configure editor options for JavaScript
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
      lineNumbers: 'on',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2, // JavaScript standard is 2 spaces
      insertSpaces: true,
      wordWrap: 'on',
      theme: 'vs-dark',
      autoIndent: 'full',
      formatOnType: true,
      formatOnPaste: true,
      detectIndentation: false, // Use our tabSize setting
      trimAutoWhitespace: true
    });

    // Add custom key bindings for JavaScript-specific behavior
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      // Custom behavior for Ctrl+Enter if needed
      console.log('Ctrl+Enter pressed');
    });

    // Handle automatic indentation on Enter
    editor.onKeyDown((e: any) => {
      if (e.keyCode === monaco.KeyCode.Enter) {
        const model = editor.getModel();
        const position = editor.getPosition();
        const lineContent = model.getLineContent(position.lineNumber);
        
        // Check if current line ends with opening brace (for JavaScript blocks)
        if (lineContent.trim().endsWith('{')) {
          setTimeout(() => {
            const newPosition = editor.getPosition();
            const currentIndent = lineContent.match(/^\s*/)?.[0] || '';
            const newIndent = currentIndent + '  '; // Add 2 spaces for JavaScript
            
            editor.executeEdits('auto-indent', [{
              range: {
                startLineNumber: newPosition.lineNumber,
                startColumn: 1,
                endLineNumber: newPosition.lineNumber,
                endColumn: 1
              },
              text: newIndent
            }]);
            
            // Move cursor to end of indentation
            editor.setPosition({
              lineNumber: newPosition.lineNumber,
              column: newIndent.length + 1
            });
          }, 0);
        }
      }
    });
  };

  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      onChange(newValue);
    }
  };

  return (
    <div className="border border-purple-500/30 rounded overflow-hidden">
      <Editor
        height={height}
        language={language}
        theme={theme}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          fontSize: 14,
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          lineNumbers: 'on',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2, // JavaScript standard
          insertSpaces: true,
          wordWrap: 'on',
          autoIndent: 'full',
          formatOnType: true,
          formatOnPaste: true,
          detectIndentation: false,
          trimAutoWhitespace: true
        }}
      />
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';