<template>
  <tree-table :data="data" :eval-func="func" :eval-args="args" :expand-all="expandAll" border>
    <el-table-column label="名称">
      <template slot-scope="scope">
        <span style="color:sandybrown">{{ scope.row.event }}</span>
        <el-tag>{{ scope.row.timeLine+'ms' }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="类型">
      <template slot-scope="scope">
        <!-- <el-tooltip :content="scope.row.timeLine+'ms'" effect="dark" placement="left"> -->
          <!-- <div class="processContainer">
            <div
              :style="{ width:scope.row._width * 500+'px',
                          background:scope.row._width>0.5?'rgba(233,0,0,.5)':'rgba(0,0,233,0.5)',
                          marginLeft:scope.row._marginLeft * 500+'px' }"
              class="process"
            >
              <span style="display:inline-block"/>
            </div>
          </div> -->
          <span>{{scope.row.timeLine}}</span>
        <!-- </el-tooltip> -->
      </template>
    </el-table-column>
    <el-table-column label="权限标识" >
      <template slot-scope="scope">
        <el-button type="text" @click="message(scope.row)">点击</el-button>
      </template>
    </el-table-column>
    <el-table-column label="链接地址"></el-table-column>
     <el-table-column label="描述"></el-table-column>
  </tree-table>
</template>
<style>
</style>
<script>
import treeTable from '../treeTable'
export default {
  components: { treeTable },
  data () {
    return {
      columns: [
        {
          text: '名称',
          value: 'name',
          width: 200,
          option: 'sonData1'
        },
        {
          text: '类型',
          value: 'typeName',
          option: 'sonData1',
          act: 'act'
        },
        {
          text: '权限标识'
        },
        {
          text: '链接地址'
        },
        {
          text: '描述'
        }
      ],
      data: {
        id: 1,
        event: '事件1',
        timeLine: 100,
        comment: '无',
        children: [
          {
            id: 2,
            event: '事件2',
            timeLine: 10,
            comment: '无'
          },
          {
            id: 3,
            event: '事件3',
            timeLine: 90,
            comment: '无',
            children: [
              {
                id: 4,
                event: '事件4',
                timeLine: 5,
                comment: '无'
              },
              {
                id: 5,
                event: '事件5',
                timeLine: 10,
                comment: '无'
              },
              {
                id: 6,
                event: '事件6',
                timeLine: 75,
                comment: '无'

              }
            ]
          }
        ]
      }
    }
  },
  methods: {
    getAuth (data) {
      let opt = []
      data.forEach(val => {
        opt.push(val.id)
        if (val.children) {
          val.children.forEach(el => {
            console.log(val.id)
            if (el.selectchecked.length) {
              opt.push(el.id)
              opt.push(el.selectchecked)
            }
          })
        }
      })
    }
  }
}
</script>
