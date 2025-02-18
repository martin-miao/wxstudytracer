<template>
  <view class="container">
    <view class="main-content">
      <!-- 左侧学员列表 -->
      <scroll-view class="left-panel" scroll-y>
      <view 
        v-for="student in students" 
        :key="student._id"
        class="student-item"
        @click="selectStudent(student._id)"
        :style="{background: selectedId === student._id ? '#f0f0f0' : ''}"
      >
        {{ student.name }}
      </view>
    </scroll-view>

      <!-- 右侧详情区域 -->
      <scroll-view class="right-panel" scroll-y>
        <view v-if="selectedStudent" class="info-table">
        <view class="row">
          <view class="col header">学员信息</view>
          <view class="col">{{ selectedStudent.info || '-' }}</view>
        </view>
        <view class="row">
          <view class="col header">缴费记录</view>
          <view class="col">
            <view v-for="(payment, index) in selectedStudent.payments" :key="index">
              {{ payment.date }} ￥{{ payment.amount }}
            </view>
          </view>
        </view>
        <view class="row">
          <view class="col header">总课时数</view>
          <view class="col">{{ selectedStudent.totalLessons }}</view>
        </view>
        <view class="row">
          <view class="col header">消减课时数</view>
          <view class="col">{{ selectedStudent.usedLessons }}</view>
        </view>
        <view class="row">
          <view class="col header">剩余课时</view>
          <view class="col">{{ selectedStudent.totalLessons - selectedStudent.usedLessons }}</view>
        </view>
        <view class="row" v-for="(lesson, index) in selectedStudent.lessons" :key="index">
          <view class="col header">第{{ index+1 }}次消减</view>
          <view class="col">
            时间：{{ lesson.date }}<br>
            成果：{{ lesson.result }}
          </view>
        </view>
        </view>
      </scroll-view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <button @click="addStudent">追加学员</button>
      <button @click="updateStudent">更新信息</button>
    </view>
  </view>
</template>

<script>
const db = uniCloud.database()
export default {
  data() {
    return {
      students: [
        {_id: 'stu1', name: '张三', totalLessons: 20, usedLessons: 5, payments: [{date: '2024-01-05', amount: 5000}], lessons: [{date: '2024-02-01', result: '完成基础训练'}]},
        {_id: 'stu2', name: '李四', totalLessons: 30, usedLessons: 12, payments: [{date: '2024-01-10', amount: 8000}], lessons: [{date: '2024-02-05', result: '中级课程通过'}]},
        {_id: 'stu3', name: '王五', totalLessons: 15, usedLessons: 3, payments: [{date: '2024-02-01', amount: 3000}], lessons: []},
        {_id: 'stu4', name: '赵六', totalLessons: 25, usedLessons: 8, payments: [{date: '2023-12-15', amount: 6000}], lessons: [{date: '2024-01-20', result: '入门考核合格'}]},
        {_id: 'stu5', name: '陈七', totalLessons: 10, usedLessons: 2, payments: [{date: '2024-02-10', amount: 2000}], lessons: [{date: '2024-02-15', result: '基础动作练习'}]
        }
      ],
      selectedId: null,
      selectedStudent: null
    }
  },
  onLoad() {
    this.loadStudents()
  },
  methods: {
    async loadStudents() {
      const res = await db.collection('students').get()
      this.students = res.result.data
    },
    async selectStudent(id) {
      this.selectedId = id
      const res = await db.collection('students').doc(id).get()
      this.selectedStudent = res.result.data[0]
    },
    async addStudent() {
      uni.showModal({
        title: '添加学员',
        content: '请输入学员姓名',
        editable: true,
        success: async res => {
          if (res.confirm) {
            await db.collection('students').add({
              name: res.content,
              totalLessons: 0,
              usedLessons: 0,
              payments: [],
              lessons: []
            })
            this.loadStudents()
          }
        }
      })
    },
    async updateStudent() {
      if (!this.selectedStudent) return
      uni.showModal({
        title: '更新信息',
        content: '编辑学员信息',
        editable: true,
        success: async res => {
          if (res.confirm) {
            await db.collection('students').doc(this.selectedId).update({
              info: res.content
            })
            this.selectStudent(this.selectedId)
          }
        }
      })
    }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.main-content {
  display: flex;
  flex: 1;
  min-height: 0; /* 修复滚动问题 */
}

.left-panel {
  width: 100px;
  height: 100%;
  background: linear-gradient(145deg, #a8edea 0%, #fed6e3 100%);
  border-radius: 12px;
  margin: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.right-panel {
  flex: 1;
  padding: 20px;
  background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
  border-radius: 12px;
  margin: 10px 10px 10px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.student-item {
  padding: 15px;
  margin: 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.student-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.info-table .row {
  display: flex;
  margin: 10px;
  padding: 15px;
  background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(246,248,252,0.9) 100%);
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.info-table .row:nth-child(even) {
  background: linear-gradient(135deg, rgba(232,240,254,0.9) 0%, rgba(237,245,250,0.9) 100%);
}

.info-table .col {
  flex: 1;
  padding: 10px;
  color: #2c3e50;
  font-size: 14px;
  line-height: 1.6;
}

.header {
  font-weight: 600;
  color: #3a5b96;
  min-width: 120px;
  font-size: 15px;
}

.bottom-bar {
  height: 80px;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

button {
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
  color: white;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  opacity: 0.9;
}
</style>

