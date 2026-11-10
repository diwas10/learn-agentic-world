declare module 'katex/dist/contrib/auto-render.mjs' {
  export interface AutoRenderDelimiter {
    left: string;
    right: string;
    display: boolean;
  }

  export interface AutoRenderOptions {
    delimiters?: AutoRenderDelimiter[];
    ignoredTags?: string[];
    ignoredClasses?: string[];
    errorCallback?: (msg: string, err: unknown) => void;
    preProcess?: (math: string) => string;
    throwOnError?: boolean;
    errorColor?: string;
  }

  export default function renderMathInElement(elem: HTMLElement, options?: AutoRenderOptions): void;
}
