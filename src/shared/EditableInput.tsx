import { useState, useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';

export interface EditableInputProps {
  value: string;
  onSave: (val: string) => void;
  className?: string;
  placeholder?: string;
  formatPrefix?: boolean;
  formatDash?: boolean;
  readOnly?: boolean;
}

export function EditableInput({
  value,
  onSave,
  className,
  placeholder,
  formatPrefix = false,
  formatDash = false,
  readOnly = false,
}: EditableInputProps) {
  const [tempValue, setTempValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = '0px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + 'px';
      textareaRef.current.focus();
    }
  }, [tempValue, isEditing]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSave(tempValue);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  // Always render as <div> when not editing — avoids Chromium PDF textarea bug
  if (!isEditing) {
    const displayValue = tempValue || '';

    // Format dash: "NAME – content" with NAME in pink uppercase bold
    if (formatDash) {
      const dashIndex = displayValue.indexOf(' – ');
      const hasDash = dashIndex > 0;
      return (
        <div
          onClick={() => !readOnly && setIsEditing(true)}
          className={`${className} ${readOnly ? '' : 'cursor-text'} leading-tight whitespace-pre-wrap`}
        >
          {hasDash ? (
            <>
              <span className="font-black text-pink-500 uppercase tracking-widest">{displayValue.slice(0, dashIndex)}</span>
              <span> – </span>
              {(() => {
                const content = displayValue.slice(dashIndex + 3);
                const colonIdx = content.indexOf(':');
                if (colonIdx > 0) {
                  return (
                    <>
                      <span className="font-bold" style={{ fontSize: '1.05em' }}>{content.slice(0, colonIdx + 1)}</span>
                      {content.slice(colonIdx + 1)}
                    </>
                  );
                }
                return content;
              })()}
            </>
          ) : (
            displayValue || <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
      );
    }

    // Format prefix: "Label: content" with label in bold
    const colonIndex = displayValue.indexOf(':');
    const hasPrefix = formatPrefix && colonIndex > 0;
    return (
      <div
        onClick={() => !readOnly && setIsEditing(true)}
        className={`${className} ${readOnly ? '' : 'cursor-text'} leading-tight whitespace-pre-wrap`}
      >
        {hasPrefix ? (
          <>
            <span className="font-bold" style={{ fontSize: '1.05em' }}>{displayValue.slice(0, colonIndex + 1)}</span>
            {displayValue.slice(colonIndex + 1)}
          </>
        ) : (
          displayValue || <span className="text-gray-400">{placeholder}</span>
        )}
      </div>
    );
  }

  return (
    <textarea
      ref={textareaRef}
      value={tempValue}
      placeholder={placeholder}
      onChange={(e) => setTempValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      rows={1}
      className={`${className} resize-none overflow-hidden block leading-tight`}
    />
  );
}
