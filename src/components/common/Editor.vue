<template>
  <div class="editor" :id="editorId" :style="{width:initWidth+'px',height:initHeight+'px'}"></div>
</template>
<script>
export default {
  props: {
    editorId: {
      type: String,
      required: true
    },
    initWidth: {
      type: Number,
      default: 500
    },
    initHeight: {
      type: Number,
      default: 300
    },
    readValue: {
      type: String,
      default: ''
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    lang: {
      type: String,
      default: 'python'
    },
    theme: {
      type: String,
      default: 'github'
    }
  },
  data () {
    return {
      editor: ''
    }
  },
  created () {
    this.$nextTick().then(() => {
      window.require('ace/ext/old_ie')
      window.require('ace/ext/language_tools')
      window.require('ace/theme/github')
      let editor = window.ace.edit(this.editorId)
      console.log(editor)
      editor.$blockScrolling = Infinity
      editor.setFontSize(12)
      if (this.readOnly) {
        editor.setReadOnly(true)
        editor.setValue(this.readValue, 0)
      }
      if (this.value !== '') {
        editor.setValue(this.value, 0)
      }

      editor.session.setMode('ace/mode/' + this.lang)
      console.log(editor.session.getDocument().getNewLineMode())
      console.log(editor.session.getDocument().getNewLineCharacter())
      editor.setTheme('ace/theme/' + this.theme)
      editor.setShowPrintMargin(false)
      editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
      })
      const me = this
      editor.on('change', function () {
        me.$emit('update:value', editor.getValue())
      })
      this.editor = editor
    })
  },
  watch: {
    readValue (newValue, oldValue) {
      this.editor.setValue(newValue, 0)
    },
    value (newValue, oldValue) {
      if (this.editor.getValue() !== newValue) {
        this.editor.setValue(newValue, 0)
      }
    }
  }
}
</script>
<style scoped>
.editor {
  border: 1px solid #d1d5da;
}
</style>
