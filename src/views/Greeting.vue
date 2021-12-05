<template>
  <n-card>
    <template #header>Welcome to VCL318!</template>
    <n-form
        :label-width="80"
        :model="formValue"
        :rules="rules"
        size="large"
    >
      <n-form-item label="姓名" path="user.name">
        <n-input v-model:value="formValue.user.name" placeholder="输入姓名" />
      </n-form-item>
      <n-form-item label="电话号码" path="phone">
        <n-input placeholder="电话号码" v-model:value="formValue.phone" />
      </n-form-item>
    </n-form>
    <n-space vertical size="large">
      <n-checkbox v-model:checked="checked">我已阅读并同意实验协议</n-checkbox>
      <n-button type="success" :disabled="!(checked && (formValue.user.name != '' ) && (formValue.phone.length == 11))" @click="jumpTo" attr-type="button">开始实验</n-button>
    </n-space>
  </n-card>
</template>

<script setup>

import { computed, ref } from "vue-demi";
import { NCard, NInput, NForm, NFormItem, NButton, NSpace, NCheckbox } from "naive-ui";
import { useRouter } from "vue-router"

const router = useRouter()

const formValue = ref({
  user: {
    name: "",
  },
  phone: ""
})

const rules = {
  user: {
    name: {
      required: true,
      message: '请输入姓名',
      trigger: 'blur'
    }
  },
  phone: {
    required: true,
    message: '请输入电话号码',
    trigger: 'blur'
  }
}

const checked = ref(false)

function isDisabled(){
  console.log(checked)
  return checked
}

function jumpTo(){
  router.push({
    path:'/'
  })
}

</script>

<style scoped>
.n-card {
  max-width: 300px;
  text-align: center;
  color: #2c3e50;
  background-color: #fff;
  border-radius: 20px;
  margin: auto;
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
}
</style>
