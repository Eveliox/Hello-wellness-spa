import { Fragment } from "react";

type Props = {
  text: string;
  className?: string;
};

const ITALIC_PATTERN = /\{italic:([^}]+)\}/g;

/**
 * Parses `{italic:phrase}` tokens in a headline and renders the phrase in
 * the script-italic peach accent style used across marketing pages. Plain
 * text outside tokens renders unchanged. Multiple tokens per headline are
 * supported. Use for hero H1/H2 where a single accent word or short phrase
 * carries the emotional weight (memberships, partners, service pages).
 */
export function HeadlineWithItalic({ text, className }: Props) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyCounter = 0;

  while ((match = ITALIC_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <Fragment key={`plain-${keyCounter++}`}>
          {text.slice(lastIndex, match.index)}
        </Fragment>,
      );
    }
    parts.push(
      <span
        key={`italic-${keyCounter++}`}
        className="font-script text-[1.3em] font-normal italic leading-none text-accent-peach"
      >
        {match[1]}
      </span>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(
      <Fragment key={`plain-${keyCounter++}`}>{text.slice(lastIndex)}</Fragment>,
    );
  }

  return <span className={className}>{parts}</span>;
}
