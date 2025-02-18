<template>
  <view class="container">
    <!-- 上部区域 -->
    <view class="top-section">
      <!-- 学员列表 -->
      <scroll-view class="student-list" scroll-y>
        <view 
          v-for="student in students" 
          :key="student._id"
          class="student-item"
          @click="selectStudent(student)"
          :class="selectedStudent && selectedStudent._id === student._id ? 'active' : ''"
        >
          {{student.name}}
        </view>
      </scroll-view>

      <!-- 学员详情 -->
      <view class="student-detail">
        <uni-card v-if="selectedStudent">
          <uni-section title="基本信息" type="line">
            <uni-list>
              <uni-list-item title="总课时" :rightText="selectedStudent.totalLessons.toString()" />
              <uni-list-item title="已消减课时" :rightText="selectedStudent.usedLessons.toString()" />
              <uni-list-item 
                title="剩余课时" 
                :rightText="(selectedStudent.totalLessons - selectedStudent.usedLessons).toString()"
              />
            </uni-list>
          </uni-section>

          <uni-section title="消减记录" type="line">
            <uni-table border stripe emptyText="暂无记录">
              <uni-tr>
                <uni-th width="150" align="center">时间</uni-th>
                <uni-th width="100" align="center">课时数</uni-th>
                <uni-th align="center">课程成果</uni-th>
              </uni-tr>
              <uni-tr v-for="(record, index) in selectedStudent.lessonRecords" :key="index">
                <uni-td>{{formatDate(record.time)}}</uni-td>
                <uni-td>{{record.amount}}</uni-td>
                <uni-td>{{record.result}}</uni-td>
              </uni-tr>
            </uni-table>
          </uni-section>
        </uni-card>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-section">
      <button class="btn" @click="addStudent">追加学员</button>
      <button class="btn" @click="updateStudent">更新学员信息</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      students: [
        {
          _id: '1',
          name: '张三',
          totalLessons: 20,
          usedLessons: 3,
          lessonRecords: [
            { time: 1735660800000, amount: 1, result: '掌握基础语法' },
            { time: 1735747200000, amount: 1, result: '完成项目练习' },
            { time: 1735833600000, amount: 1, result: '通过阶段测试' }
          ]
        },
        {
          _id: '2',
          name: '李四',
          totalLessons: 15,
          usedLessons: 2,
          lessonRecords: [
            { time: 1735920000000, amount: 1, result: '学习组件化' },
            { time: 1736006400000, amount: 1, result: '完成实战项目' }
          ]
        }
      ],
      selectedStudent: null
    }
  },
  created() {
    this.loadStudents();
  },
  methods: {
    selectStudent(student) {
      this.selectedStudent = student;
    },
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleString();
    },
    addStudent() {
      // 添加学员逻辑
    },
    updateStudent() {
      // 更新学员逻辑
    }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.top-section {
  flex: 1;
  display: flex;
  padding: 10px;
}

.student-list {
  width: 200px;
  margin-right: 10px;
  border-right: 1px solid #eee;
}

.student-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.student-item.active {
  background-color: #f0f0f0;
}

.student-detail {
  flex: 1;
}

.bottom-section {
  padding: 10px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
}

.btn {
  flex: 1;
  background-color: #007AFF;
  color: white;
  border-radius: 5px;
}
</style>
