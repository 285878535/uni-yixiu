<template>
  <van-popup
    v-model:show="show"
    position="left"
    :style="{ height: '100%', width: '80%', background: '#EAEAEA' }"
  >
    <div class="more-content">
      <div class="user-data">
        <div class="user-info">
          <div class="avatar">
            <img
              :src="
                userStore.user.avatar ||
                userStore.user.picture ||
                '/src/assets/images/avatar.png'
              "
              alt="头像"
            />
          </div>
          <!-- <div class="avatar"><img src="/src/assets/images/avatar.png" alt="" ></div> -->
          <div class="user-name">{{ userStore.user.name || "游客" }}</div>
          <div
            class="user-pro"
            @click="showPopup = true"
            v-if="userStore.user.isPro == 0"
          >
            升级pro
          </div>
          <div class="user-pro-text" v-if="userStore.user.isPro == 1">
            Pro会员
          </div>
        </div>
        <div class="line"></div>
        <div class="others">
          <div class="others-item">
            <div class="item-count">
              {{ userStore.user.repairCount || "0" }}
            </div>
            <div class="item-dis">次修车</div>
          </div>
          <div class="others-item">
            <div class="item-count">{{ userStore.user.day || "0" }}</div>
            <div class="item-dis">天</div>
          </div>
        </div>
      </div>
      <div class="handle">
        <div
          class="handle-item"
          @click="onHandle(item.to)"
          v-for="item in handleList"
          :key="item.label"
        >
          {{ item.label }}
        </div>
      </div>
      <van-button type="primary" class="logout" @click="logout"
        >退出登录</van-button
      >
    </div>
  </van-popup>
  <van-popup
    v-model:show="showPopup"
    round
    position="bottom"
    :style="{ width: '100%', height: '95%' }"
  >
    <div class="popup-header">
      <span>升级Pro版</span>
      <van-icon name="cross" @click="showPopup = false" class="close-icon" />
    </div>
    <div class="popup-content">
      <!-- 这里可根据实际需求添加内容，比如套餐介绍等 -->
      这里可根据实际需求添加内容，比如套餐介绍等
      这里可根据实际需求添加内容，比如套餐介绍等
      这里可根据实际需求添加内容，比如套餐介绍等
    </div>
    <div class="popup-footer">
      <van-button type="default" @click="handleAlipay" block
        >连续包月</van-button
      >
      <van-button type="default" @click="handleAlipayYear" block
        >连续包年</van-button
      >
    </div>
  </van-popup>
  <!-- 这里会动态插入支付宝表单 -->
  <div ref="alipayFormContainer"></div>
  <van-dialog
    v-model:show="showDialog"
    :show-cancel-button="false"
    :show-confirm-button="false"
    close-on-click-overlay
    title="退出登录"
  >
    <div style="text-align: center; padding: 10px">
      <p style="text-align: center; padding: 10px">请确认是否退出登录！</p>
      <div
        @click="handleConfirmLogout"
        style="
          padding: 4px 30px;
          text-align: center;
          background-color: #ffa360;
          display: inline-block;
          border-radius: 20px;
          color: #fff;
          margin-top: 20px;
        "
      >
        确认
      </div>
    </div>
  </van-dialog>
</template>

<script setup>
import { useRouter } from "vue-router"
import { ref } from "vue"
import { logoutApi } from "@/api/user"
import RequestLoading from "@/utils/RequestLoading"
const showDialog = ref(false)
const showPopup = ref(false)
const userStore = useUserStore()
const router = useRouter()
const props = defineProps({
  showMore: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(["update:showMore"])
const show = computed({
  get() {
    return props.showMore
  },
  set(val) {
    emit("update:showMore", val)
  },
})
const handleList = [
  { label: "个人资料", to: "/userEdit" },
  // { label: "联系我们" },
  // { label: "设置" },
]
const onHandle = (path) => {
  router.push(path)
}
const logout = () => {
  showDialog.value = true
}
const handleConfirmLogout = async () => {
  await RequestLoading(logoutApi)
  userStore.logout()
  showDialog.value = false
  show.value = false
  router.push("/login")
}
const alipayFormContainer = ref(null)

//支付宝支付包月
const handleAlipay = async () => {
  router.push({
    path: "/alipay",
    query: { type: "0" },
  })
}

const handleAlipayYear = async () => {
  router.push({
    path: "/alipay",
    query: { type: "1" },
  })
}
</script>

<style lang="scss" scoped>
.more-content {
  padding-top: 60px;
  position: relative;
  min-height: 100vh;

  .user-data {
    border: solid 1px #fff;
    border-radius: 20px;
    background-color: #fff;
    margin: 14px;
    min-height: 147px;
    padding: 10px 0;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 0 20px;
    margin-top: 10px;
    flex-wrap: wrap;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .user-name {
      font-size: 16px;
      font-weight: 400;
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .user-pro {
      font-size: 10px;
      font-weight: 400;
      cursor: pointer;
      padding: 4px 12px;
      background: #ffa360;
      color: #fff;
      border-radius: 12px;
      white-space: nowrap;
    }

    .user-pro-text {
      font-size: 10px;
      padding: 4px 12px;
      background: #ffa360;
      color: #fff;
      border-radius: 12px;
      white-space: nowrap;
    }
  }

  .line {
    border: solid 1px #d9d9d9;
    width: calc(100% - 50px);
    margin: 20px auto 0;
  }

  .others {
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 20px;
    margin-top: 20px;

    .others-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;

      .item-count {
        font-size: 28px;
        line-height: 28px;
        color: #545454;
        font-weight: 500;
      }

      .item-dis {
        font-size: 10px;
        color: #aaa;
        margin-top: 8px;
      }
    }
  }

  .handle {
    margin: 20px 14px 14px;
    border-radius: 20px;
    background: #fff;

    .handle-item {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 44px;
      padding: 12px 20px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      font-size: 16px;

      &:not(:last-child) {
        border-bottom: 1px solid #f5f5f5;
      }
    }

    .handle-item::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.05);
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: none;
    }

    .handle-item:active::after {
      opacity: 1;
    }
  }

  .logout {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 100px);
    max-width: 275px;
    min-height: 44px;
    border-radius: 20px;
  }
}

// 升级pro
.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1;

  span {
    font-size: 18px;
    font-weight: 500;
  }
}

.close-icon {
  font-size: 24px;
  padding: 4px;
  cursor: pointer;
}

.popup-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  min-height: 200px;
  font-size: 14px;
  line-height: 1.6;
}

.popup-footer {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  background: #fff;
  border-top: 1px solid #f5f5f5;
  position: sticky;
  bottom: 0;

  .van-button {
    flex: 1;
    min-height: 44px;
    border-radius: 22px;
    font-size: 16px;
  }
}

// 响应式适配
@media (max-width: 320px) {
  .more-content {
    .user-info {
      gap: 12px;

      .user-name {
        font-size: 14px;
      }
    }

    .others {
      .others-item {
        .item-count {
          font-size: 24px;
        }
      }
    }

    .logout {
      width: calc(100% - 60px);
    }
  }
}

@media (min-width: 414px) {
  .more-content {
    .user-data {
      margin: 20px;
    }

    .handle {
      margin: 20px;
    }
  }
}
</style>
