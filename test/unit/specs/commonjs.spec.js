import { evil } from '@/utils/commonjs'
import Json from '../../testdata/Jsondata'

describe('commonjs方法测试', () => {
  it('evil方法测试:string类型json转array类型object', function (done) {
    let stringjson = JSON.stringify(Json)
    expect(evil(stringjson)).to.be.an('array')
    done()
  })
})
