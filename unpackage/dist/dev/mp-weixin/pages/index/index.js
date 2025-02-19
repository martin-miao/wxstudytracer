"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const students = common_vendor.ref([]);
    const currentIndex = common_vendor.ref(-1);
    const editMode = common_vendor.ref(false);
    const editForm = common_vendor.ref({
      name: "",
      totalLessons: 0,
      usedLessons: 0,
      payments: [],
      consumptions: []
    });
    const currentStudent = common_vendor.computed(() => {
      return students.value[currentIndex.value];
    });
    const remainingLessons = common_vendor.computed(() => {
      var _a, _b;
      return ((_a = currentStudent.value) == null ? void 0 : _a.totalLessons) - ((_b = currentStudent.value) == null ? void 0 : _b.usedLessons) || 0;
    });
    const init = () => {
      if (typeof common_vendor.wx$1 !== "undefined") {
        const systemInfo = common_vendor.wx$1.getSystemInfoSync();
        if (!systemInfo.platform) {
          setTimeout(init, 100);
          return;
        }
      }
      try {
        const localData = common_vendor.index.getStorageSync("students");
        if (localData) {
          students.value = JSON.parse(localData);
          currentIndex.value = students.value.length > 0 ? 0 : -1;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:158", "数据加载失败:", e);
      }
    };
    common_vendor.onMounted(() => {
      setTimeout(init, 300);
    });
    const saveData = () => {
      try {
        common_vendor.index.setStorageSync("students", JSON.stringify(students.value));
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:172", "数据保存失败:", e);
        common_vendor.index.showToast({
          title: "保存失败",
          icon: "none"
        });
      }
    };
    const updateStudent = () => {
      if (editMode.value) {
        if (editForm.value.usedLessons > editForm.value.totalLessons) {
          common_vendor.index.showToast({
            title: "已消耗课时不能超过总课时",
            icon: "none"
          });
          return;
        }
        students.value[currentIndex.value] = {
          ...students.value[currentIndex.value],
          name: editForm.value.name,
          totalLessons: Number(editForm.value.totalLessons),
          usedLessons: Number(editForm.value.usedLessons),
          payments: [...editForm.value.payments],
          consumptions: [...editForm.value.consumptions]
        };
        saveData();
        editMode.value = false;
      } else {
        if (currentStudent.value) {
          editForm.value = JSON.parse(JSON.stringify(currentStudent.value));
          editMode.value = true;
        }
      }
    };
    const addStudent = () => {
      if (editMode.value)
        return;
      students.value.push({
        name: `新学员${students.value.length + 1}`,
        payments: [],
        totalLessons: 0,
        usedLessons: 0,
        consumptions: []
      });
      currentIndex.value = students.value.length - 1;
      saveData();
    };
    return (_ctx, _cache) => {
      var _a;
      return common_vendor.e({
        a: common_vendor.f(students.value, (student, index, i0) => {
          return {
            a: common_vendor.t(student.name),
            b: common_vendor.t(student.totalLessons),
            c: index,
            d: currentIndex.value === index ? 1 : "",
            e: common_vendor.o(($event) => currentIndex.value = index, index)
          };
        }),
        b: currentStudent.value
      }, currentStudent.value ? common_vendor.e({
        c: editMode.value
      }, editMode.value ? {
        d: editForm.value.name,
        e: common_vendor.o(($event) => editForm.value.name = $event.detail.value)
      } : {
        f: common_vendor.t(currentStudent.value.name)
      }, {
        g: editMode.value
      }, editMode.value ? {
        h: editForm.value.totalLessons,
        i: common_vendor.o(common_vendor.m(($event) => editForm.value.totalLessons = $event.detail.value, {
          number: true
        }))
      } : {
        j: common_vendor.t(currentStudent.value.totalLessons)
      }, {
        k: editMode.value
      }, editMode.value ? {
        l: editForm.value.usedLessons,
        m: common_vendor.o(common_vendor.m(($event) => editForm.value.usedLessons = $event.detail.value, {
          number: true
        }))
      } : {
        n: common_vendor.t(currentStudent.value.usedLessons)
      }, {
        o: common_vendor.t(remainingLessons.value),
        p: editMode.value
      }, editMode.value ? {
        q: common_vendor.o(($event) => editForm.value.payments.push({
          date: (/* @__PURE__ */ new Date()).toLocaleDateString(),
          amount: 0
        }))
      } : {}, {
        r: common_vendor.f(editMode.value ? editForm.value.payments : currentStudent.value.payments, (pay, i, i0) => {
          return common_vendor.e(editMode.value ? {
            a: pay.date,
            b: common_vendor.o(($event) => pay.date = $event.detail.value, i)
          } : {
            c: common_vendor.t(pay.date)
          }, editMode.value ? {
            d: pay.amount,
            e: common_vendor.o(common_vendor.m(($event) => pay.amount = $event.detail.value, {
              number: true
            }), i)
          } : {
            f: common_vendor.t(pay.amount)
          }, editMode.value ? {
            g: common_vendor.o(($event) => editForm.value.payments.splice(i, 1), i)
          } : {}, {
            h: i
          });
        }),
        s: editMode.value,
        t: editMode.value,
        v: editMode.value,
        w: common_vendor.t(((_a = currentStudent.value) == null ? void 0 : _a.usedLessons) || 0),
        x: editMode.value
      }, editMode.value ? {
        y: common_vendor.o(($event) => editForm.value.consumptions.push({
          date: (/* @__PURE__ */ new Date()).toLocaleDateString(),
          note: ""
        }))
      } : {}, {
        z: common_vendor.f(editMode.value ? editForm.value.consumptions : currentStudent.value.consumptions, (item, idx, i0) => {
          return common_vendor.e(editMode.value ? {
            a: item.date,
            b: common_vendor.o(($event) => item.date = $event.detail.value, idx)
          } : {
            c: common_vendor.t(idx + 1),
            d: common_vendor.t(item.date)
          }, editMode.value ? {
            e: item.note,
            f: common_vendor.o(($event) => item.note = $event.detail.value, idx)
          } : {
            g: common_vendor.t(item.note)
          }, editMode.value ? {
            h: common_vendor.o(($event) => editForm.value.consumptions.splice(idx, 1), idx)
          } : {}, {
            i: idx
          });
        }),
        A: editMode.value,
        B: editMode.value,
        C: editMode.value
      }) : {}, {
        D: editMode.value ? 1 : "",
        E: common_vendor.o(addStudent),
        F: common_vendor.t(editMode.value ? "💾 保存" : "✏️ 编辑信息"),
        G: editMode.value ? 1 : "",
        H: common_vendor.o(updateStudent)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
