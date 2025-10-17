import sanitizeHtml from 'sanitize-html';

type Props = {
  html?: string | null;
  className?: string;
  /** If your WYSIWYG sometimes saves localhost asset URLs, set this true in prod */
  rewriteAssetHost?: boolean;
};

const sanitizeConfig: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    // headings
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    // text blocks & inline
    'p',
    'span',
    'strong',
    'em',
    'small',
    'sup',
    'sub',
    'abbr',
    'code',
    'pre',
    'kbd',
    'hr',
    // lists
    'ol',
    'ul',
    'li',
    // quotes
    'blockquote',
    // media
    'img',
    'figure',
    'figcaption',
    'iframe',
    // tables
    'table',
    'thead',
    'tbody',
    'tfoot',
    'tr',
    'th',
    'td',
    'colgroup',
    'col',
    'caption',
    // disclosure
    'details',
    'summary',
  ]),

  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel'],
    img: [
      'src',
      'alt',
      'title',
      'width',
      'height',
      'loading',
      'decoding',
      'srcset',
      'sizes',
    ],
    iframe: [
      'src',
      'width',
      'height',
      'title',
      'allow',
      'allowfullscreen',
      'frameborder',
      'referrerpolicy',
    ],
    table: ['border'],
    '*': ['class', 'style'], // keep, but pair with allowedStyles below
  },

  // Keep only the inline CSS you actually need
  allowedStyles: {
    '*': {
      'text-align': [/^(left|right|center|justify)$/],
      'text-decoration': [/^(underline)$/],
    },
    table: {
      'border-collapse': [/^(collapse|separate)$/],
      width: [/^\d+(\.\d+)?(px|%)?$/],
    },
    th: {
      width: [/^\d+(\.\d+)?(px|%)?$/],
      'text-align': [/^(left|right|center)$/],
    },
    td: {
      width: [/^\d+(\.\d+)?(px|%)?$/],
      'text-align': [/^(left|right|center)$/],
    },
    col: { width: [/^\d+(\.\d+)?(px|%)?$/] },
  },

  // Good hygiene
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedIframeHostnames: [
    'www.youtube.com',
    'youtube.com',
    'player.vimeo.com',
  ],

  // (Nice to have) ensure safe external links
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', {
      target: '_blank',
      rel: 'noopener noreferrer nofollow',
    }),
    // make images lazy if author forgot
    img: (tag, attrs) => ({
      tagName: 'img',
      attribs: { loading: 'lazy', ...attrs },
    }),
  },
};

export default function HtmlContent({ html, className }: Props) {
  if (!html) return null;

  const prepped = html;
  const clean = sanitizeHtml(prepped, sanitizeConfig);

  return (
    <div
      className={['prose w-full', className].filter(Boolean).join(' ')}
      // It is safe because we sanitized `clean` above
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
