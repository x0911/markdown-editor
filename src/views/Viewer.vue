<template>
  <div>
    <v-card tile flat>
      <v-card-title>
        Viewer
        <v-spacer></v-spacer>
        <v-btn depressed to="/">
          Content
          <v-icon class="ms-2">mdi-keyboard-backspace mdi-rotate-180</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="font-size: inherit; line-height: inherit">
        <div style="border: 1px solid #e0e2e3" class="pa-4 secondary--text">
          <vue-markdown
            :html="true"
            :source="content.text"
            :emoji="true"
          ></vue-markdown>
        </div>
      </v-card-text>
      <v-card-text class="pt-2" style="color: rgb(51 61 69 / 60%)">
        <div>
          {{ content.footnote }}
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import VueMarkdown from "vue-markdown";
export default {
  name: "Viewer",
  components: {
    VueMarkdown,
  },
  data: () => ({
    content: {
      text: "",
      footnote: "",
    },
  }),
  mounted() {
    this.getTextFromLocalStorage();
    this.getFootnoteFromLocalStorage();
  },
  methods: {
    getTextFromLocalStorage() {
      const text = this.$ls.get("markdown-editor.text", "");
      setTimeout(() => {
        this.$set(
          this.content,
          "text",
          text.replace(/<br \/>/g, "\n").replace(/<br>/g, "\n")
        );
      }, 100);
    },
    getFootnoteFromLocalStorage() {
      const text = this.$ls.get("markdown-editor.footnote", "");
      setTimeout(() => {
        this.$set(this.content, "footnote", text);
      }, 100);
    },
  },
};
</script>
