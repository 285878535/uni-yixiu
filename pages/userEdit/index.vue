<template>
  <view class="tabbar-page user-edit-page">
    <view class="edit-header">
      <text class="back-icon" @click="goBack">‹</text>
      <text class="title">个人资料</text>
      <text class="save" @click="save">保存</text>
    </view>

    <view class="content">
      <view
        class="form_item"
        v-for="(item, index) in optionsContainer"
        :key="index"
      >
        <text class="form_label">{{ item.label }}</text>
        <view
          class="form_right"
          @click="item.handle ? item.handle(item.props) : null"
        >
          <view v-if="item.props === 'picture'">
            <image
              v-if="imgSrc"
              :src="imgSrc"
              mode="aspectFill"
              class="avatar-img"
            />
            <view
              v-else
              class="avatar-placeholder"
            ></view>
            <input
              style="display: none"
              type="file"
              accept="image/*"
              @change="onAvatarChange"
              ref="fileInput"
            />
          </view>
          <template v-else>
            <input
              v-if="item.props === 'name'"
              type="text"
              v-model="formData[item.props + '_text']"
              :placeholder="
                formData[item.props + '_text'] ? '' : '请输入' + item.label
              "
              class="form_input"
              @click.stop
            />
            <text
              v-else
              class="form_value"
              :class="{ form_value_empty: !formData[item.props + '_text'] }"
            >
              {{ formData[item.props + "_text"] || "请选择" + item.label }}
            </text>
          </template>
          <text
            v-if="item.props !== 'name'"
            class="form_arrow"
          >›</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { navigateBack, navigateTo } from '@/utils/router'
import { sendPictureApi, sendUserInfoApi } from "@/api/user"
import RequestLoading from "@/utils/RequestLoading"
import PopupService from "@/utils/PopupService"
import { getRoleLevelListApi, getUserInfo } from "@/api/user"
import { useUserStore } from "@/store/modules/user"

const userStore = useUserStore()
const formData = ref({
  picture: "",
  name: "",
  sex: "",
  role: "",
  workAge: "",
  level: "",
  address: "",
  skills: [],
  picture_text: "",
  name_text: "",
  sex_text: "",
  role_text: "",
  workAge_text: "",
  level_text: "",
  address_text: "",
  skills_text: "",
})
const imgSrc = ref("")
const configList = ref({
  levelList: [],
  addressList: [],
  roleList: [],
})
const fileInput = ref(null)

const onAvatarChange = async (e) => {
  // uni-app 中处理文件选择
  // #ifdef H5
  const f = e.target.files && e.target.files[0]
  if (!f) return
  if (!f.type || !f.type.startsWith("image/")) {
    console.warn("Only image files are allowed")
    return
  }
  const reader = new FileReader()
  reader.onload = (event) => {
    imgSrc.value = event.target.result
  }
  reader.readAsDataURL(f)

  const formDataToUpload = new FormData()
  formDataToUpload.append("file", f)
  try {
    const { msg } = await RequestLoading(sendPictureApi, formDataToUpload)
    formData.value.picture = msg
    imgSrc.value = import.meta.env.VITE_SERVER + "/" + msg
  } catch (error) {
    console.error("头像上传失败:", error)
  }
  // #endif
  
  // #ifndef H5
  // 小程序和 App 平台使用 uni.chooseImage
  uni.chooseImage({
    count: 1,
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0]
      imgSrc.value = tempFilePath
      
      // 上传图片
      uni.uploadFile({
        url: import.meta.env.VITE_SERVER + '/login/upload/picture',
        filePath: tempFilePath,
        name: 'file',
        header: {
          'Authorization': `Bearer ${uni.getStorageSync('token')}`
        },
        success: (uploadRes) => {
          try {
            const data = JSON.parse(uploadRes.data)
            if (data.msg) {
              formData.value.picture = data.msg
              imgSrc.value = import.meta.env.VITE_SERVER + "/" + data.msg
            }
          } catch (e) {
            console.error('解析上传结果失败:', e)
          }
        },
        fail: (err) => {
          console.error("头像上传失败:", err)
          uni.showToast({
            title: '上传失败',
            icon: 'none'
          })
        }
      })
    }
  })
  // #endif
}

const onHandleImg = () => {
  // #ifdef H5
  if (fileInput.value) {
    fileInput.value.click()
  }
  // #endif
  
  // #ifndef H5
  onAvatarChange()
  // #endif
}

const onHandlePop = (key) => {
  const current = optionsContainer.value.find((i) => i.props === key)
  PopupService.open({
    component:
      key === "skills"
        ? "AreasExpertise"
        : key === "address"
        ? "ChinaAreaSelect"
        : "UserConfig",
    style: {
      height: "80%",
    },
    props: {
      columns: current?.columns || [],
      title: current.label,
      prop: key,
      model: formData.value,
      onChange: (val) => {
        if (key === "address" && val && typeof val === "object") {
          formData.value.address = val.codes
          formData.value.address_text = val.text
        } else if (key === "skills" && val && typeof val === "object") {
          const text = []
          formData.value[key] = val
          configList.value.addressList.forEach((item) => {
            if (val.includes(item.code)) {
              text.push(item.name)
            }
          })
          formData.value[key + "_text"] = text.join(" / ")
        } else {
          formData.value[key] = val[0].value
          formData.value[key + "_text"] = val[0].text
        }
        if (key === "workAge_text") {
          formData.value.workAge = val[0].value
          formData.value.workAge_text = val[0].text
        }
      },
    },
  })
}

const goBack = () => {
  navigateBack()
}

const save = async () => {
  const {
    picture,
    name_text,
    sex,
    role,
    workAge,
    level,
    address,
    skills,
    address_text,
  } = formData.value
  const params = {
    picture,
    name: name_text,
    sex,
    role,
    workAge,
    level,
    address: address_text.split(" ").join(","),
    skills: skills.join(","),
  }
  try {
    const res = await RequestLoading(sendUserInfoApi, params)
    const { data: userInfo } = await RequestLoading(getUserInfo)
    userStore.login({
      name: userInfo.name,
      avatar: userInfo.picture,
      userId: userInfo.id,
      repairCount: userInfo.repairCount,
      day: userInfo.day,
      isPro: userInfo.isPro,
    })
    navigateTo('archives')
  } catch (error) {
    console.error(error)
  }
}

const optionsContainer = computed(() => [
  { label: "头像", props: "picture", handle: onHandleImg },
  { label: "昵称", props: "name" },
  {
    label: "性别",
    props: "sex",
    handle: onHandlePop,
    columns: [
      { text: "男", value: "1" },
      { text: "女", value: "2" },
    ],
  },
  {
    label: "角色",
    props: "role",
    columns: configList.value.roleList,
    handle: onHandlePop,
  },
  {
    label: "擅长领域",
    props: "skills",
    handle: onHandlePop,
    columns: configList.value.addressList,
  },
  {
    label: "工龄",
    props: "workAge",
    handle: onHandlePop,
    columns: [
      { text: "1年", value: "1" },
      { text: "2年", value: "2" },
      { text: "3年", value: "3" },
      { text: "4年", value: "4" },
      { text: "5年", value: "5" },
      { text: "6年", value: "6" },
      { text: "7年", value: "7" },
      { text: "8年", value: "8" },
      { text: "9年", value: "9" },
      { text: "10年", value: "10" },
      { text: "11年", value: "11" },
      { text: "12年", value: "12" },
      { text: "13年", value: "13" },
      { text: "14年", value: "14" },
      { text: "15年", value: "15" },
    ],
  },
  {
    label: "级别",
    props: "level",
    columns: configList.value.levelList,
    handle: onHandlePop,
  },
  { label: "城市", props: "address", handle: onHandlePop },
])

const getOptions = async () => {
  const { data } = await getRoleLevelListApi()
  const keys = ["levelList", "addressList", "roleList"]
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const element = data[key]
      configList.value[keys[Number(key) - 1]] = element.map((i) => ({
        text: i.name,
        value: i.code,
        ...i,
      }))
    }
  }
}

const onLoad = async () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  if (!currentPage.options?.first) {
    console.log("不是新用户")
    try {
      const { data: user } = await getUserInfo()

      formData.value.picture = user.picture || ""
      formData.value.name = user.name || ""
      formData.value.sex = String(user.sex || "")
      formData.value.role = String(user.role || "")
      formData.value.workAge = String(user.workAge || "")
      formData.value.level = String(user.level || "")
      formData.value.address = user.address || ""
      formData.value.skills = user.skills ? user.skills.split(",") : []

      imgSrc.value = user.picture
        ? import.meta.env.VITE_SERVER + "/" + user.picture
        : ""
      formData.value.name_text = user.name || ""
      formData.value.sex_text =
        user.sex === 1 ? "男" : user.sex === 2 ? "女" : ""

      const roleItem = configList.value.roleList.find(
        (i) => String(i.value) === String(user.role)
      )
      formData.value.role_text = roleItem ? roleItem.text : ""
      formData.value.workAge_text = user.workAge ? `${user.workAge}年` : ""
      const levelItem = configList.value.levelList.find(
        (i) => String(i.value) === String(user.level)
      )
      formData.value.level_text = levelItem ? levelItem.text : ""
      formData.value.address_text = user.address || ""

      if (formData.value.skills.length) {
        const skillsName = []
        configList.value.addressList.forEach((item) => {
          if (formData.value.skills.includes(String(item.value))) {
            skillsName.push(item.text)
          }
        })
        formData.value.skills_text = skillsName.join(" / ")
      }
    } catch (error) {
      console.error("加载用户信息失败:", error)
    }
  }
}

onMounted(async () => {
  await getOptions()
  await onLoad()
})
</script>

<style scoped>
.tabbar-page {
  padding: 0;
}

.edit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #000;
}

.edit-header .title {
  font-weight: 600;
}

.back-icon {
  font-size: 30px;
  color: #333;
}

.save {
  font-size: 16px;
  color: #333;
}

.content {
  display: flex;
  flex-direction: column;
}

.form_item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  min-height: 58px;
  padding: 16px 30px;
  border-bottom: 1px solid #000;
}

.form_label {
  color: #999;
  font-size: 14px;
  flex-shrink: 0;
}

.form_item .form_right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: flex-end;
  padding-right: 0;
}

.form_item .form_right .form_input {
  flex: 0 0 auto;
  width: auto;
  text-align: right;
  border: none;
  outline: none;
  background: transparent;
  color: #333;
  font-size: 14px;
  max-width: 200px;
}

.form_item .form_right .form_value {
  text-align: right;
  color: #333;
  font-size: 14px;
  flex: 0 0 auto;
  max-width: 200px;
  word-wrap: break-word;
  white-space: normal;
  line-height: 1.4;
}

.form_item .form_right .form_value.form_value_empty {
  color: #999;
}

.form_item .form_right .form_arrow {
  flex-shrink: 0;
  font-size: 20px;
  color: #999;
}

.avatar-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.avatar-placeholder {
  width: 50px;
  height: 50px;
  background: #acacac;
  border-radius: 50%;
}
</style>
