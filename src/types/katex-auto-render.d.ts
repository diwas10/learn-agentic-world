declare module 'katex/dist/contrib/auto-render.mjs' {
  interface RenderMathInElementOptions {
    delimiters?: Array<{
      left: string;
      right: string;
      display: boolean;
    }>;
    ignoredTags?: string[];
    ignoredClasses?: string[];
    errorCallback?: (msg: string, err: any) => void;
    preProcess?: (math: string) => string;
    throwOnError?: boolean;
    errorColor?: string;
    macros?: Record<string, any>;
    colorIsTextColor?: boolean;
    maxSize?: number;
    maxExpand?: number;
    strict?: boolean | string | ((errorCode: string, errorMsg: string, token: any) => string | boolean);
    trust?: boolean | ((context: any) => boolean);
  }

  function renderMathInElement(elem: HTMLElement, options?: RenderMathInElementOptions): void;
  export default renderMathInElement;
}
