import type { TwistyPlayer as TwistyPlayerElement } from "cubing/twisty";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "twisty-player": React.DetailedHTMLProps<
        React.HTMLAttributes<TwistyPlayerElement> & {
          puzzle?: string;
          alg?: string;
          "experimental-stickering"?: string;
          "hint-facelets"?: string;
          "control-panel"?: string;
          "back-view"?: string;
          background?: string;
        },
        TwistyPlayerElement
      >;
    }
  }
}

export {};
