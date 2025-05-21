import { Node, mergeAttributes, InputRule, escapeForRegEx, nodeInputRule, PasteRule, combineTransactionSteps, getChangedRanges, findChildrenInRange } from "@tiptap/react";
import { PluginKey, Plugin } from "@tiptap/pm/state";
import Suggestion from "@tiptap/suggestion";
import emojiRegex from "emoji-regex";
import { isEmojiSupported } from "is-emoji-supported";
import type { EmojiItem, EmojiOptions, EmojiStorage } from "./types";
import emojiData from "@emoji-mart/data";
import type { EmojiMartData } from "@emoji-mart/data";

// Convert emoji-mart data to our EmojiItem format
function parseEmojiMartData(): EmojiItem[] {
  const emojiList: EmojiItem[] = [];
  const typedData = emojiData as EmojiMartData;

  Object.keys(typedData.emojis).forEach(key => {
    const emoji = typedData.emojis[key];
    emojiList.push({
      emoji: emoji.skins[0].native,
      name: emoji.id,
      shortcodes: [emoji.id],
      tags: emoji.keywords || [],
      group: emoji.id || "smileys & emotion",
      emoticons: emoji.emoticons || [],
      version: emoji.version || 1,
      fallbackImage: `https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji.skins[0].unified.toLowerCase()}.png`
    });
  });

  return emojiList;
}

const emojis = parseEmojiMartData();

// We can still keep GitHub custom emojis or any other custom emojis
const gitHubCustomEmojis: EmojiItem[] = [{
  name: "atom", shortcodes: ["atom"],
  tags: [], group: "GitHub", fallbackImage: "https://github.githubassets.com/images/icons/emoji/atom.png"
}, {
  name: "basecamp", shortcodes: ["basecamp"],
  tags: [], group: "GitHub", fallbackImage: "https://github.githubassets.com/images/icons/emoji/basecamp.png"
}, {
  name: "basecampy", shortcodes: ["basecampy"],
  tags: [], group: "GitHub", fallbackImage: "https://github.githubassets.com/images/icons/emoji/basecampy.png"
},]
const gitHubEmojis: EmojiItem[] = [...emojis, ...gitHubCustomEmojis];

function emojiToShortcode(emoji: string, emojiList: EmojiItem[]): string | undefined {
  const item = emojiList.find((item => item.emoji === emoji.replace("︎", "").replace("️", "")));
  return item?.shortcodes[0];
}

function shortcodeToEmoji(shortcode: string, emojiList: EmojiItem[]): EmojiItem | undefined {
  return emojiList.find((item => shortcode === item.name || item.shortcodes.includes(shortcode)));
}
const pluginKey = new PluginKey("emojiSuggestion");
const inputRegex = /:([a-zA-Z0-9_+-]+):$/;
const pasteRegex = /:([a-zA-Z0-9_+-]+):/g;

// We're extending the type to match what's in the types.d.ts
// This ensures compatibility with the module declaration
const Emoji = Node.create<EmojiOptions, EmojiStorage>({
  name: "emoji",
  inline: true,
  group: "inline",
  selectable: false,
  addOptions() {
    return {
      HTMLAttributes: {},
      emojis: emojis,
      enableEmoticons: false,
      forceFallbackImages: false,
      suggestion: {
        char: ":",
        pluginKey,
        command: ({ editor, range, props }) => {
          const nodeAfter = editor.view.state.selection.$to.nodeAfter;
          if (nodeAfter?.text?.startsWith(" ")) {
            range.to += 1;
          }
          editor.chain().focus().insertContentAt(range, [
            { type: this.name, attrs: props },
            { type: "text", text: " " }
          ]).command(({ tr, state }) => {
            tr.setStoredMarks(state.doc.resolve(state.selection.to - 2).marks());
            return true;
          }).run();
        },
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from);
          const type = state.schema.nodes[this.name];
          return !!$from.parent.type.contentMatch.matchType(type);
        }
      }
    }
  },
  addStorage() {
    const { emojis } = this.options;

    const uniqueVersions = Array.from(new Set(emojis.map(e => e.version)))
      .filter((version): version is number => typeof version === 'number');

    const versionSupport = uniqueVersions.reduce<Record<number, boolean>>((result, version) => {
      const emojiWithVersion = emojis.find(e => e.version === version && e.emoji);
      return {
        ...result,
        [version]: !!emojiWithVersion && isEmojiSupported(emojiWithVersion.emoji as string)
      };
    }, {});

    return {
      emojis: this.options.emojis,
      isSupported: (item: EmojiItem) => !!item.version && versionSupport[item.version]
    };
  },
  addAttributes: () => ({
    name: {
      default: null,
      parseHTML: element => element.dataset.name,
      renderHTML: attributes => ({ "data-name": attributes.name })
    }
  }),
  parseHTML() {
    return [{ tag: `span[data-type="${this.name}"]` }]
  },
  renderHTML({ HTMLAttributes, node }) {
    const emojiItem = shortcodeToEmoji(node.attrs.name, this.options.emojis);
    const attributes = mergeAttributes(HTMLAttributes, this.options.HTMLAttributes, { "data-type": this.name });

    if (!emojiItem) return ["span", attributes, `:${node.attrs.name}:`];

    const isSupported = this.storage.isSupported(emojiItem);
    const hasEmoji = !!emojiItem?.emoji;
    const hasFallbackImage = !!emojiItem?.fallbackImage;

    const shouldUseFallbackImage =
      this.options.forceFallbackImages && !hasEmoji ||
      this.options.forceFallbackImages && hasFallbackImage ||
      this.options.forceFallbackImages && !isSupported && hasFallbackImage ||
      (!isSupported || !hasEmoji) && hasFallbackImage;

    return ["span", attributes, shouldUseFallbackImage
      ? ["img", {
        src: emojiItem.fallbackImage,
        draggable: "false",
        loading: "lazy",
        align: "absmiddle"
      }]
      : emojiItem.emoji || `:${emojiItem.shortcodes[0]}:`
    ];
  },
  renderText({ node }) {
    const emojiItem = shortcodeToEmoji(node.attrs.name, this.options.emojis);
    return emojiItem?.emoji || `:${node.attrs.name}:`
  },
  addCommands() {
    return {
      setEmoji: (shortcode: string) => ({ chain }) => {
        const emoji = shortcodeToEmoji(shortcode, this.options.emojis);

        if (!emoji) {
          return false;
        }

        return chain()
          .insertContent({
            type: this.name,
            attrs: { name: emoji.name }
          })
          .command(({ tr, state }) => {
            tr.setStoredMarks(state.doc.resolve(state.selection.to - 1).marks());
            return true;
          })
          .run();
      }
    };
  },

  addInputRules() {
    const rules: InputRule[] = [];

    rules.push(new InputRule({
      find: inputRegex,
      handler: ({ range, match, chain }) => {
        const shortcode = match[1];
        if (shortcodeToEmoji(shortcode, this.options.emojis)) {
          chain().insertContentAt(range, {
            type: this.name,
            attrs: { name: shortcode }
          }).command(({ tr, state }) => {
            tr.setStoredMarks(state.doc.resolve(state.selection.to - 1).marks());
            return true;
          }).run();
        }
      }
    }));

    if (this.options.enableEmoticons) {
      const emoticons = this.options.emojis
        .map(item => item.emoticons || [])
        .flat()
        .filter(emoticon => !!emoticon);

      const pattern = new RegExp(`(?:^|\\s)(${emoticons.map(emoticon => escapeForRegEx(emoticon)).join("|")}) $`);

      rules.push(nodeInputRule({
        find: pattern,
        type: this.type,
        getAttributes: match => {
          const emoticon = match[1];
          const emojiItem = this.options.emojis.find(item => {
            return item.emoticons?.includes(emoticon);
          });

          if (emojiItem) return { name: emojiItem.name };
          return null;
        }
      }));
    }

    return rules;
  },
  addPasteRules() {
    return [
      new PasteRule({
        find: pasteRegex,
        handler: ({ range, match, chain }) => {
          const shortcode = match[1];
          if (shortcodeToEmoji(shortcode, this.options.emojis)) {
            chain().insertContentAt(
              range,
              { type: this.name, attrs: { name: shortcode } },
              { updateSelection: false }
            ).command(({ tr, state }) => {
              tr.setStoredMarks(state.doc.resolve(state.selection.to - 1).marks());
              return true;
            }).run();
          }
        }
      })
    ];
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({ editor: this.editor, ...this.options.suggestion }),
      new Plugin({
        key: new PluginKey("emoji"),
        props: {
          handleDoubleClickOn: (view, pos, node) => {
            if (node.type !== this.type) return false;

            const from = pos;
            const to = from + node.nodeSize;

            this.editor.commands.setTextSelection({ from, to });
            return true;
          }
        },
        appendTransaction: (transactions, oldState, newState) => {
          if (!(transactions.some(tr => tr.docChanged) && !oldState.doc.eq(newState.doc)))
            return;

          const { tr } = newState;
          const steps = combineTransactionSteps(oldState.doc, [...transactions]);

          getChangedRanges(steps).forEach(({ newRange }) => {
            if (newState.doc.resolve(newRange.from).parent.type.spec.code)
              return;

            findChildrenInRange(newState.doc, newRange, node => node.type.isText)
              .forEach(({ node, pos }) => {
                if (!node.text) return;

                [...node.text.matchAll(emojiRegex())].forEach(match => {
                  if (match.index === undefined) return;

                  const emojiText = match[0];
                  const shortcode = emojiToShortcode(emojiText, this.options.emojis);

                  if (!shortcode) return;

                  const from = tr.mapping.map(pos + match.index);

                  if (newState.doc.resolve(from).parent.type.spec.code)
                    return;

                  const to = from + emojiText.length;
                  const node = this.type.create({ name: shortcode });

                  tr.replaceRangeWith(from, to, node);
                  tr.setStoredMarks(newState.doc.resolve(from).marks());
                });
              });
          });

          return tr.steps.length ? tr : undefined;
        }
      })
    ];
  }
});

export {
  Emoji,
  pluginKey as EmojiSuggestionPluginKey,
  Emoji as default,
  emojiToShortcode,
  emojis,
  gitHubCustomEmojis,
  gitHubEmojis,
  inputRegex,
  pasteRegex,
  shortcodeToEmoji
};
