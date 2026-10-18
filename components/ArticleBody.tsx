import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { makeIdGenerator } from '@/lib/markdown';

const textOf = (node: React.ReactNode): string =>
  typeof node === 'string' || typeof node === 'number'
    ? String(node)
    : Array.isArray(node)
      ? node.map(textOf).join('')
      : node && typeof node === 'object' && 'props' in node
        ? textOf((node as { props: { children?: React.ReactNode } }).props.children)
        : '';

// Markdown is rendered to React elements, not raw HTML, so author-written <script> or HTML is never executed.
// Unsafe link protocols such as javascript: are removed by react-markdown's default URL handling.
export default function ArticleBody({ source, lang }: { source: string; lang: string }) {
  const nextId = makeIdGenerator();
  return (
    <div lang={lang} className="article-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h2 id={nextId(textOf(children))}>{children}</h2>,
          h2: ({ children }) => <h2 id={nextId(textOf(children))}>{children}</h2>,
          h3: ({ children }) => <h3 id={nextId(textOf(children))}>{children}</h3>,
          a: ({ href, children }) => (
            <a href={href} rel="noopener noreferrer nofollow ugc">{children}</a>
          ),
          // eslint-disable-next-line @next/next/no-img-element
          img: ({ src, alt }) => <img src={typeof src === 'string' ? src : undefined} alt={alt ?? ''} loading="lazy" />,
          table: ({ children }) => (
            <div className="overflow-x-auto"><table>{children}</table></div>
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
