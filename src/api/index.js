import * as bmsApi from './apis/bmsApi';
import * as cmdbApi from './apis/cmdbApi';
import * as deliveryApi from './apis/deliveryApi';
import * as aibmsApi from './apis/aibmsApi';
import * as devopsApi from './apis/devopsApi';
import * as resourceManageApi from './apis/resourceManageApi';
import * as workflowApi from './apis/workflowApi';
const apiObject = Object.assign({}, bmsApi, cmdbApi, deliveryApi, devopsApi, resourceManageApi, workflowApi, aibmsApi);
export default apiObject;
