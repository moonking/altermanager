define("ace/theme/atom_dark",["require","exports","module","ace/lib/dom"], function(require, exports, module) {
  exports.isDark = true;
  exports.cssClass = "ace-atom_dark";
  exports.cssText = "\
  .ace-atom_dark .ace_gutter {\
  background: #282c34;\
  color: rgb(99,109,103);\
  }\
  .ace-atom_dark .ace_print-margin {\
  width: 1px;\
  background: #555651\
  }\
  .ace-atom_dark {\
  background-color: #282c34;\
  color: #F8F8F2\
  }\
  .ace_editor.ace-atom_dark {\
  font-family:SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace;\
  line-height: 20px;\
  }\
  .ace_editor.ace-atom_dark {\
  font-family:SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace;\
  line-height: 20px;\
  }\
  .ace-atom_dark .ace_cursor {\
  color: #F8F8F0\
  }\
  .ace-atom_dark .ace_marker-layer .ace_selection {\
  background: #49483E\
  }\
  .ace-atom_dark.ace_multiselect .ace_selection.ace_start {\
  box-shadow: 0 0 3px 0px #272822;\
  }\
  .ace-atom_dark .ace_marker-layer .ace_step {\
  background: rgb(102, 82, 0)\
  }\
  .ace-atom_dark .ace_marker-layer .ace_bracket {\
  margin: -1px 0 0 -1px;\
  border: 1px solid #49483E\
  }\
  .ace-atom_dark .ace_marker-layer .ace_active-line {\
  background: #a8a8a81f\
  }\
  .ace-atom_dark .ace_gutter-active-line {\
  background-color: #272727\
  }\
  .ace-atom_dark .ace_marker-layer .ace_selected-word {\
  border: 1px solid #49483E\
  }\
  .ace-atom_dark .ace_invisible {\
  color: #52524d\
  }\
  .ace-atom_dark .ace_entity.ace_name.ace_tag,\
  .ace-atom_dark .ace_keyword,\
  .ace-atom_dark .ace_meta.ace_tag,\
  .ace-atom_dark .ace_storage {\
  color: #ea7575\
  }\
  .ace-atom_dark .ace_punctuation,\
  .ace-atom_dark .ace_punctuation.ace_tag {\
  color: #fff\
  }\
  .ace-atom_dark .ace_constant.ace_character,\
  .ace-atom_dark .ace_constant.ace_language,\
  .ace-atom_dark .ace_constant.ace_numeric,\
  .ace-atom_dark .ace_constant.ace_other {\
  color: #AE81FF\
  }\
  .ace-atom_dark .ace_invalid {\
  color: #F8F8F0;\
  background-color: #F92672\
  }\
  .ace-atom_dark .ace_invalid.ace_deprecated {\
  color: #F8F8F0;\
  background-color: #AE81FF\
  }\
  .ace-atom_dark .ace_support.ace_constant,\
  .ace-atom_dark .ace_support.ace_function {\
  color: #66D9EF\
  }\
  .ace-atom_dark .ace_fold {\
  background-color: #A6E22E;\
  border-color: #F8F8F2\
  }\
  .ace-atom_dark .ace_storage.ace_type,\
  .ace-atom_dark .ace_support.ace_class,\
  .ace-atom_dark .ace_support.ace_type {\
  color: #c678d2\
  }\
  .ace-atom_dark .ace_entity.ace_name.ace_function{\
    color: #5acef2;\
  }\
  .ace-atom_dark .ace_entity.ace_other,\
  .ace-atom_dark .ace_entity.ace_other.ace_attribute-name,\
  .ace-atom_dark .ace_variable {\
  color: #d19a5f\
  }\
  .ace-atom_dark .ace_variable.ace_language {\
    color: #c678d2\
    }\
  .ace-atom_dark .ace_variable.ace_parameter {\
  color: #FD971F\
  }\
  .ace-atom_dark .ace_string {\
  color: #8dd993\
  }\
  .ace-atom_dark .ace_comment {\
  color: #5c6370\
  }\
  .ace-atom_dark .ace_boolean {\
    color: #d19a5f !important\
  }\
  .ace-atom_dark .ace_identifier.ace_variable {\
    color: #5acef2;\
  }\
  .ace-atom_dark .ace_indent-guide {\
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ0FD0ZXBzd/wPAAjVAoxeSgNeAAAAAElFTkSuQmCC) right repeat-y\
  }";
  var dom = require("../lib/dom");
  dom.importCssString(exports.cssText, exports.cssClass);
  });                (function() {
                      window.require(["ace/theme/atom_dark"], function(m) {
                          if (typeof module == "object" && typeof exports == "object" && module) {
                              module.exports = m;
                          }
                      });
                  })();
              