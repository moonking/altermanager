// 接口整合
import * as bmsApi from './apis/bmsApi';
import * as cmdbApi from './apis/cmdbApi';
import * as aibmsApi from './apis/aibmsApi';
import * as workflowApi from './apis/workflowApi';
const apiObject = Object.assign({}, bmsApi, cmdbApi, workflowApi, aibmsApi);
export default apiObject;
