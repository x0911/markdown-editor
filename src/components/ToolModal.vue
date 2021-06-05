<template>
  <div>
    <v-dialog v-model="models.editor" scrollable persistent max-width="600">
      <v-card style="position: relative">
        <v-card-title>
          Add Item
          <v-spacer></v-spacer>
          <v-btn icon @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <template v-for="(option, i) in options">
            <div :key="i" v-if="option.tools.includes(tool)">
              <div class="font-weight-medium secondary--text mb-2">
                {{ option.label }}
              </div>
              <div>
                <v-text-field
                  v-if="option.type == 'text'"
                  :placeholder="option.placeholder"
                  single-line
                  :label="option.placeholder"
                  outlined
                  :disabled="
                    option.model === 'link' &&
                    values['file'] !== null &&
                    typeof values['file'] === 'object'
                  "
                  v-model="values[option.model]"
                ></v-text-field>
                <v-file-input
                  v-else-if="option.type == 'file'"
                  :placeholder="option.placeholder"
                  single-line
                  :label="option.placeholder"
                  outlined
                  prepend-icon=""
                  v-model="values[option.model]"
                ></v-file-input>
                <v-textarea
                  v-else-if="option.type == 'textarea'"
                  single-line
                  :label="option.placeholder"
                  outlined
                  v-model="values[option.model]"
                ></v-textarea>
              </div>
            </div>
          </template>
        </v-card-text>
        <v-card-actions class="px-6">
          <v-btn class="text-none" text color="error" @click="del()">
            Delete
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="text-none px-6"
            text
            color="grey"
            large
            @click="close()"
          >
            Discard
          </v-btn>
          <v-btn
            class="text-none px-6"
            outlined
            color="primary"
            large
            @click="save()"
          >
            Save Content
          </v-btn>
        </v-card-actions>
        <v-layout
          align-center
          justify-center
          align-content-center
          fill-height
          style="
            position: absolute;
            width: 100%;
            background: rgba(255, 255, 255, 0.5);
          "
          v-if="fakeProgress.perc > 0"
        >
          <div>
            <v-progress-circular
              color="primary"
              size="250"
              width="8"
              :value="fakeProgress.perc"
            >
              <div class="text-center">
                <div class="mb-4 text-h2">{{ fakeProgress.perc }}%</div>
                <div>Uploading {{ tool }}</div>
              </div>
            </v-progress-circular>
          </div>
        </v-layout>
      </v-card>
    </v-dialog>
    <v-dialog v-model="models.del" max-width="450">
      <v-card>
        <v-card-title>
          Delete item
          <v-spacer></v-spacer>
          <v-btn icon @click="models.del = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div>It's a joke, you can't delete what you didn't create yet!</div>
          <div>Actually, you can't delete anything for now :"D</div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "ToolModal",
  data: () => ({
    models: {
      editor: false,
      del: false,
      fakeProgressRanBefore: false,
    },
    fakeProgress: {
      perc: 0,
    },
    tool: null,
    options: [
      {
        tools: ["video", "file", "link", "quote", "button"],
        label: "The text",
        placeholder: "eg: The amazing spider-man 3",
        type: "text",
        model: "name",
      },
      {
        tools: ["image", "video", "file", "link", "button"],
        label: "Paste a Link here",
        placeholder: "eg: https://link-to-some-file.mp4",
        type: "text",
        model: "link",
      },
      {
        tools: ["image", "video", "file"],
        label: "or, Upload your file",
        placeholder: "Choose from gallery",
        type: "file",
        model: "file",
      },
      {
        tools: ["footnote"],
        label: "Your text",
        placeholder: "Start typing here",
        type: "textarea",
        model: "textarea",
      },
    ],
    values: {},
  }),
  watch: {
    async "values.file"(v) {
      if (
        v &&
        v !== null &&
        typeof v === "object" &&
        !this.models.fakeProgressRanBefore
      ) {
        this.$set(this.models, "fakeProgressRanBefore", true);
        await this.fakeFileUpload();
        this.$set(this.fakeProgress, "perc", 0);
      }
    },
  },
  methods: {
    fakeFileUpload() {
      return new Promise((resolve) => {
        const intval = setInterval(() => {
          this.fakeProgress.perc += 7;
          if (this.fakeProgress.perc > 100) {
            clearInterval(intval);
            resolve(true);
          }
        }, 500);
      });
    },
    open(tool) {
      this.$set(this, "values", {});
      this.$set(this.models, "fakeProgressRanBefore", false);
      this.$set(this, "tool", tool);
      if (tool === "footnote") {
        this.getFootnoteFromLocalStorage();
      }
      this.$set(this.models, "editor", true);
    },
    close() {
      this.$set(this, "tool", null);
      this.$set(this.models, "editor", false);
    },
    save() {
      const tool = this.tool;
      const { name, textarea, link, file } = this.values;
      let text = "";
      switch (tool) {
        case "image":
          text += `[img="${
            file && file.name ? "https://our-storage/" + file.name : link
          }"]`;
          break;
        case "video":
        case "file":
          text += `[${name ? name : tool}](${
            file && file.name ? "https://our-storage/" + file.name : link
          })`;
          break;
        case "quote":
          text += ` > ${name}`;
          break;
        case "button":
          text += `[${name}](${link}){: .btn}`;
          break;
        case "footnote":
          this.$emit("saveFootnote", textarea);
          break;
      }
      this.$emit("saved", text);
      this.close();
    },
    del() {
      this.$set(this.models, "del", true);
    },
    getFootnoteFromLocalStorage() {
      const text = this.$ls.get("markdown-editor.footnote", "");
      setTimeout(() => {
        this.$set(this.values, "textarea", text);
      }, 100);
    },
  },
};
</script>
