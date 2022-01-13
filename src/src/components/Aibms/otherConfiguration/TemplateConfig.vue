<template>
  <div class="temp">
    <el-input
      @input="filterText"
      clearable
      :rows="inputH"
      ref="text"
      class="text-input"
      type="textarea"
      :autosize="inputH?false:true"
      :placeholder="placeholderText"
      v-model="textContent.content"
    ></el-input>
  </div>
</template>

<script>
export default {
  name: 'TemplateConfig',
  props: {
    StringList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    clickNum: {
      type: Number,
      default: () => {
        return -1;
      }
    },
    inputH: {
      type: Number,
      default: () => {
        return 3;
      }
    },
    placeholderText: {
      type: String,
      default: () => {
        return '';
      }
    },
    textContent: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    clickNum: {
      handler (val) {
        this.insertAtCursor(this.StringList[val]);
      },
      deep: true
    }
  },
  data () {
    return {};
  },
  methods: {
    // 过滤字符
    filterText (val) {
      this.$set(
        this.textContent,
        'content',
        this.textContent.content.replace(/卧槽/, ' * * ')
      );
    },
    // 获取光标位置
    insertAtCursor (item) {
      const myField = this.$refs.text;
      const myValue = item.value;
      if (
        myField.$el.children[0].selectionStart ||
        myField.$el.children[0].selectionStart === 0
      ) {
        var startPos = myField.$el.children[0].selectionStart;
        var endPos = myField.$el.children[0].selectionEnd;
        this.textContent.content =
          myField.value.substring(0, startPos) +
          '[[' +
          item.value +
          ']]' +
          myField.value.substring(endPos, myField.value.length + 2);
        myField.blur();
        myField.focus();
      } else {
        this.textContent.content += '{' + myValue + 2 + '}';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.temp {
  .text-input {
    width: 60%;
  }
}
</style>
