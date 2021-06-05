<template>
  <div>
    <v-card tile flat>
      <v-card-title>
        Content
        <v-spacer></v-spacer>
        <v-btn depressed to="/viewer">
          Viewer
          <v-icon class="ms-2">mdi-keyboard-backspace mdi-rotate-180</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="font-size: inherit; line-height: inherit">
        <div style="border: 1px solid #e0e2e3">
          <v-app-bar color="transparent" tile flat height="auto">
            <v-toolbar-items style="flex-flow: wrap">
              <template v-for="(tool, i) in tools">
                <v-btn
                  :key="i"
                  class="text-none font-weight-regular"
                  text
                  style="height: 45px !important"
                  color="#999EA2"
                  @click="useTool(tool)"
                >
                  {{ tool }}
                </v-btn>
              </template>
            </v-toolbar-items>
          </v-app-bar>
          <v-divider class="mx-4 mb-2"></v-divider>
          <div
            ref="markdown-editor"
            class="pa-4 secondary--text"
            style="outline: none; min-height: 40px"
            :contenteditable="true"
            v-html="content.markup"
            @input="changedText"
          ></div>
          <!-- @click="setCursorIndex"
            @change="setCursorIndex"
            @keyup="setCursorIndex" -->
        </div>
      </v-card-text>
      <v-card-text class="pt-2" style="color: rgb(51 61 69 / 60%)">
        <div>
          {{ content.footnote }}
        </div>
      </v-card-text>
    </v-card>
    <tool-modal
      ref="tool-modal"
      @saved="saveTool"
      @saveFootnote="saveFootnoteToLocalStorage"
    ></tool-modal>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {
    ToolModal: () => import("@/components/ToolModal.vue"),
  },
  data: () => ({
    tools: [
      "Image",
      "Video",
      "Quote",
      "Footnote",
      "Link",
      "Button",
      "File",
      "2 Columns",
      "Table",
      "Table row",
    ],
    stringsToHighlight: [
      "[col-right]",
      "[/col-right]",
      "[col-left]",
      "[/col-left]",
      "[table]",
      "[/table]",
      "[row]",
      "[/row]",
    ],
    content: {
      text: "",
      markup: "",
      cursorIndex: 0,
      footnote:
        "**Bold** *Italic* _Underline_ - List with bullets # H1 ## H2 ### H3 #### H4 ##### H5 ###### H6",
    },
  }),
  mounted() {
    this.getTextFromLocalStorage();
    this.getFootnoteFromLocalStorage();
  },
  watch: {
    // "content.text"(text) {
    //   console.log(text);
    // },
  },
  methods: {
    useTool(tool) {
      const tools = this.tools;
      if (tool && tools.includes(tool)) {
        const name = tool.toLowerCase().replace(/ /g, "-");
        let text = "";
        switch (name) {
          case "2-columns":
            text += `[col-left] Left Content Here [/col-left][col-right] Right Content Here [/col-right]`;
            break;
          case "table":
            text += `[table] <br /> [/table]`;
            break;
          case "table-row":
            text += `[row]  [/row]`;
            break;
          default:
            this.$refs["tool-modal"].open(name);
            break;
        }
        if (text && text.length > 0) {
          this.saveTool(text);
        }
      }
    },
    saveTool(textToPush) {
      this.$set(
        this.content,
        "text",
        this.content.text + ` <div> <br /> ${textToPush}</div>`
      );
      this.pushMarkup(this.content.text);
      this.changedText({}, this.content.text);
    },
    pushMarkup(text) {
      const stringsToHighlight = this.stringsToHighlight;
      let newText = "";
      stringsToHighlight.forEach((string) => {
        const regex = new RegExp(
          // eslint-disable-next-line no-useless-escape
          string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
          "g"
        );
        newText = newText ? newText : text;
        newText = newText.replace(
          regex,
          `<span class="primary--text">${string}</span>`
        );
      });
      this.$set(this.content, "markup", newText);
    },
    changedText(event, useThisText = "") {
      const text = useThisText ? useThisText : event?.target?.innerText;
      const stringsToHighlight = this.stringsToHighlight;
      let newText = "";
      stringsToHighlight.forEach((string) => {
        const regex = new RegExp(
          `<span class="primary--text">${string}</span>`.replace(
            // eslint-disable-next-line no-useless-escape
            /[-\/\\^$*+?.()|[\]{}]/g,
            "\\$&"
          ),
          "g"
        );
        newText = newText ? newText : text;
        newText = newText.replace(regex, string);
      });
      this.saveTextToLocalStorage(newText);
    },
    saveTextToLocalStorage(text) {
      this.$ls.set("markdown-editor.text", text);
    },
    getTextFromLocalStorage() {
      const text = this.$ls.get("markdown-editor.text", "");
      setTimeout(() => {
        this.$set(
          this.content,
          "text",
          text.replace(/\n/g, "<br />").replace(/\r/g, "<br />")
        );
        this.pushMarkup(this.content.text);
      }, 100);
    },
    saveFootnoteToLocalStorage(text) {
      this.$set(this.content, "footnote", text);
      this.$ls.set("markdown-editor.footnote", text);
    },
    getFootnoteFromLocalStorage() {
      const text = this.$ls.get("markdown-editor.footnote", "");
      setTimeout(() => {
        this.$set(this.content, "footnote", text);
      }, 100);
    },
    setCursorIndex() {
      const editor = this.$refs["markdown-editor"];
      this.$set(this.content, "cursorIndex", editor.selectionEnd);
      console.log(this.content.cursorIndex);
    },
  },
};
</script>
