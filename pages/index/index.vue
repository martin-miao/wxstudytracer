<template>
	<view class="container">
		<!-- 左上学员列表 -->
		<scroll-view class="left-panel" scroll-y>
			<view 
				v-for="(student, index) in students" 
				:key="index"
				class="student-item"
				:class="{active: currentIndex === index}"
				@click="currentIndex = index"
			>
				<text class="student-name">{{ student.name }}</text>
				<text class="lesson-count">{{ student.totalLessons }}课时</text>
			</view>
		</scroll-view>

		<!-- 右上学员详情 -->
		<scroll-view class="right-panel" scroll-y>
			<view v-if="currentStudent" class="detail-card">
				<!-- 基本信息 -->
				<view class="info-section gradient-blue">
					<view class="section-header">
						<text class="section-title">基本信息</text>
						<input 
							v-if="editMode"
							v-model="editForm.name"
							class="edit-input"
							placeholder="输入学员姓名"
							style="width: 200rpx;"
						/>
						<text v-else class="section-title">{{ currentStudent.name }}</text>
					</view>
					<view class="info-grid">
						<view class="info-item">
							<text class="info-label">总课时</text>
							<input v-if="editMode" v-model.number="editForm.totalLessons" type="number" class="edit-input" />
							<text v-else class="info-value">{{ currentStudent.totalLessons }}</text>
						</view>
						<view class="info-item">
							<text class="info-label">已消耗</text>
							<input v-if="editMode" v-model.number="editForm.usedLessons" type="number" class="edit-input" />
							<text v-else class="info-value warn">{{ currentStudent.usedLessons }}</text>
						</view>
						<view class="info-item">
							<text class="info-label">剩余</text>
							<text class="info-value success">{{ remainingLessons }}</text>
						</view>
					</view>
				</view>

				<!-- 缴费记录 -->
				<view class="section gradient-purple">
					<view class="section-header">
						<text class="section-title">缴费记录</text>
						<button v-if="editMode" @click="editForm.payments.push({ date: new Date().toLocaleDateString(), amount: 0 })" 
							class="btn-add-record">+ 添加</button>
					</view>
					<view class="record-list">
						<view 
							v-for="(pay, i) in editMode ? editForm.payments : currentStudent.payments" 
							:key="i"
							class="record-item"
						>
							<input v-if="editMode" v-model="pay.date" class="edit-input small" placeholder="日期" />
							<text v-else class="date">{{ pay.date }}</text>
							
							<view class="amount-container">
								<input v-if="editMode" v-model.number="pay.amount" type="number" class="edit-input small" placeholder="金额" />
								<text v-else class="amount">+￥{{ pay.amount }}</text>
								<button v-if="editMode" @click="editForm.payments.splice(i, 1)" class="btn-remove">×</button>
							</view>
						</view>
					</view>
				</view>

				<!-- 消课记录 -->
				<view class="section gradient-green">
					<view class="section-header">
						<text class="section-title">消课记录（{{ currentStudent?.usedLessons || 0 }}次）</text>
						<button v-if="editMode" @click="editForm.consumptions.push({ date: new Date().toLocaleDateString(), note: '' })" 
							class="btn-add-record">+ 添加</button>
					</view>
					<view class="consumption-list">
						<view 
							v-for="(item, idx) in editMode ? editForm.consumptions : currentStudent.consumptions" 
							:key="idx"
							class="consumption-item"
						>
							<view class="consumption-header">
								<input v-if="editMode" v-model="item.date" class="edit-input small" placeholder="日期" />
								<template v-else>
									<text class="order">第{{ idx + 1 }}次</text>
									<text class="date">{{ item.date }}</text>
								</template>
							</view>
							<input v-if="editMode" v-model="item.note" class="edit-input" placeholder="填写课程内容" />
							<text v-else class="note">{{ item.note }}</text>
							<button v-if="editMode" @click="editForm.consumptions.splice(idx, 1)" class="btn-remove">×</button>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 底部操作按钮 -->
		<view class="action-bar">
			<button class="btn-add" :class="{ disabled: editMode }" @click="addStudent">➕ 新学员</button>
			<button class="btn-edit" :class="{ save: editMode }" @click="updateStudent">
				{{ editMode ? '💾 保存' : '✏️ 编辑信息' }}
			</button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 学员数据
const students = ref([])
const currentIndex = ref(-1)
const editMode = ref(false)
const editForm = ref({
	name: '',
	totalLessons: 0,
	usedLessons: 0,
	payments: [],
	consumptions: []
})

// 当前选中学员
const currentStudent = computed(() => {
	return students.value[currentIndex.value]
})

// 剩余课时计算
const remainingLessons = computed(() => {
	return currentStudent.value?.totalLessons - currentStudent.value?.usedLessons || 0
})

// 初始化方法
const init = () => {
	// 添加微信环境检测
	if (typeof wx !== 'undefined') {
		const systemInfo = wx.getSystemInfoSync()
		if (!systemInfo.platform) {
			setTimeout(init, 100)
			return
		}
	}

	try {
		const localData = uni.getStorageSync('students')
		if(localData) {
			students.value = JSON.parse(localData)
			currentIndex.value = students.value.length > 0 ? 0 : -1
		}
	} catch(e) {
		console.error('数据加载失败:', e)
	}
}

// 正确使用生命周期钩子（必须在setup上下文中）
onMounted(() => {
	setTimeout(init, 300) // 增加300ms延迟确保环境初始化完成
})

// 保存数据
const saveData = () => {
	try {
		uni.setStorageSync('students', JSON.stringify(students.value))
	} catch(e) {
		console.error('数据保存失败:', e)
		uni.showToast({
			title: '保存失败',
			icon: 'none'
		})
	}
}

// 更新学员信息方法
const updateStudent = () => {
	if (editMode.value) {
		// 添加数据验证
		if (editForm.value.usedLessons > editForm.value.totalLessons) {
			uni.showToast({
				title: '已消耗课时不能超过总课时',
				icon: 'none'
			})
			return
		}
		
		// 更新数据时保持原有支付记录和消费记录
		students.value[currentIndex.value] = {
			...students.value[currentIndex.value],
			name: editForm.value.name,
			totalLessons: Number(editForm.value.totalLessons),
			usedLessons: Number(editForm.value.usedLessons),
			payments: [...editForm.value.payments],
			consumptions: [...editForm.value.consumptions]
		}
		
		saveData()
		editMode.value = false
	} else {
		if (currentStudent.value) {
			// 使用深拷贝初始化编辑表单
			editForm.value = JSON.parse(JSON.stringify(currentStudent.value))
			editMode.value = true
		}
	}
}

// 添加学员
const addStudent = () => {
	if (editMode.value) return
	
	students.value.push({
		name: `新学员${students.value.length + 1}`,
		payments: [],
		totalLessons: 0,
		usedLessons: 0,
		consumptions: []
	})
	currentIndex.value = students.value.length - 1
	saveData()
}
</script>

<style lang="scss">
$primary-color: #4a90e2;
$success-color: #7ed321;
$warn-color: #f5a623;
$bg-color: #f8f9fa;

.container {
	display: flex;
	height: 100vh;
	background: $bg-color;
}

.left-panel {
	width: 35%;
	background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	border-right: 1px solid #dee2e6;
	box-shadow: 2px 0 8px rgba(0,0,0,0.05);

	.student-item {
		padding: 20rpx;
		margin: 15rpx;
		background: white;
		border-radius: 12rpx;
		transition: all 0.3s ease;
		display: flex;
		flex-direction: column;
		border: 1px solid #dee2e6;

		&.active {
			background: linear-gradient(135deg, $primary-color 0%, #6ab0f3 100%);
			border-color: $primary-color;
			transform: translateX(10rpx);
			
			.student-name, .lesson-count {
				color: white;
			}
		}

		.student-name {
			font-size: 32rpx;
			font-weight: 500;
			color: #343a40;
		}

		.lesson-count {
			font-size: 24rpx;
			color: #6c757d;
		}
	}
}

.right-panel {
	flex: 1;
	padding: 20rpx;

	.detail-card {
		background: white;
		border-radius: 20rpx;
		box-shadow: 0 4px 12px rgba(0,0,0,0.08);
		overflow: hidden;
	}
}

.section {
	padding: 30rpx;
	margin-bottom: 30rpx;
	position: relative;

	&-title {
		display: block;
		font-size: 32rpx;
		font-weight: 600;
		color: white;
		margin-bottom: 30rpx;
		position: relative;
		z-index: 1;
	}
}

.gradient-blue {
	background: linear-gradient(135deg, $primary-color 0%, #6ab0f3 100%);
}

.gradient-purple {
	background: linear-gradient(135deg, #9b59b6 0%, #be90d4 100%);
}

.gradient-green {
	background: linear-gradient(135deg, #2ecc71 0%, #7ed321 100%);
}

.info-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 20rpx;

	.info-item {
		background: rgba(255,255,255,0.15);
		padding: 20rpx;
		border-radius: 12rpx;
		text-align: center;
		backdrop-filter: blur(5px);
	}

	.info-label {
		display: block;
		color: rgba(255,255,255,0.8);
		font-size: 28rpx;
	}

	.info-value {
		display: block;
		font-size: 40rpx;
		font-weight: bold;
		color: white;
		margin-top: 10rpx;

		&.success { color: $success-color; }
		&.warn { color: $warn-color; }
	}
}

.record-list {
	.record-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		background: rgba(255,255,255,0.1);
		border-radius: 8rpx;
		margin-bottom: 15rpx;

		.date {
			color: rgba(255,255,255,0.9);
			font-size: 28rpx;
		}

		.amount {
			color: $success-color;
			font-weight: bold;
		}
	}
}

.consumption-list {
	.consumption-item {
		background: rgba(255,255,255,0.1);
		border-radius: 12rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;

		.consumption-header {
			display: flex;
			justify-content: space-between;
			margin-bottom: 10rpx;

			.order {
				color: white;
				font-weight: bold;
			}

			.date {
				color: rgba(255,255,255,0.8);
			}
		}

		.note {
			color: rgba(255,255,255,0.9);
			font-size: 28rpx;
		}
	}
}

.action-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	padding: 20rpx;
	background: white;
	box-shadow: 0 -4px 12px rgba(0,0,0,0.05);

	button {
		flex: 1;
		margin: 0 15rpx;
		height: 80rpx;
		border-radius: 50rpx;
		font-size: 32rpx;
		transition: all 0.3s ease;
		border: none;

		&.btn-add {
			background: linear-gradient(135deg, $primary-color 0%, #6ab0f3 100%);
			color: white;
		}

		&.btn-edit {
			background: linear-gradient(135deg, #2ecc71 0%, #7ed321 100%);
			color: white;
		}

		&:active {
			transform: scale(0.95);
			opacity: 0.9;
		}
	}
}

// 新增样式
.edit-input {
	background: rgba(255,255,255,0.2);
	border: 1px solid rgba(255,255,255,0.3);
	border-radius: 8rpx;
	padding: 10rpx;
	color: white;
	text-align: center;
	
	&.small {
		max-width: 150rpx;
		padding: 6rpx;
		font-size: 28rpx;
	}
}

.btn-add-record {
	display: inline-block;
	padding: 6rpx 20rpx;
	background: rgba(255,255,255,0.2);
	border-radius: 20rpx;
	color: white;
	font-size: 24rpx;
	margin-left: 15rpx;
}

.btn-remove {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	background: rgba(255,255,255,0.2);
	color: white;
	margin-left: 10rpx;
}

.amount-container {
	display: flex;
	align-items: center;
}

.disabled {
	opacity: 0.5;
	pointer-events: none;
}

.btn-edit.save {
	background: linear-gradient(135deg, #f5a623 0%, #ffc107 100%) !important;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
