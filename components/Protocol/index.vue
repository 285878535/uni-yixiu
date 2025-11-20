<template>
  <div class="terms-of-service">
    <header class="header">
      <h1>彩虹一修平台用户服务协议</h1>
      <div class="last-update">
        <p>发布日期：{{ publishDate }}</p>
        <p>生效日期：{{ effectiveDate }}</p>
      </div>
    </header>

    <div class="container">
      <!-- 目录导航 -->
      <nav class="toc-nav" :class="{ 'fixed-nav': isNavFixed }">
        <h3>目录导航</h3>
        <ul>
          <li v-for="section in sections" :key="section.id">
            <a
              :href="`#${section.id}`"
              @click="scrollToSection(section.id)"
              :class="{ active: activeSection === section.id }"
            >
              {{ section.title }}
            </a>
          </li>
        </ul>
      </nav>

      <!-- 主要内容 -->
      <main class="content">
        <!-- 特别说明 -->
        <section class="content-section" id="intro">
          <p>
            彩虹一修平台（以下统称"本产品"）是由彩虹无线（北京）新技术有限公司（下称"本公司"或"我们"）所有和负责运营，本协议双方为本公司与本产品注册用户（下称"用户"或"您"）签定的具有合同效力的文件。
          </p>
          <p>
            请您在注册成为本产品用户前务必仔细阅读本协议内容，若您不同意本协议的任何内容，或者无法准确理解本公司对条款的解释，请不要进行后续操作；若您注册成为本产品用户，则表示您对本协议的全部内容已充分阅读并认可和同意遵守。同时，承诺遵守中国法律、法规、规章及其他政府规范性文件规定，如有违反而造成任何法律后果，您将以本人名义独立承担所有相应的法律责任。
          </p>
          <p>
            如您未满18周岁，请在监护人陪同下仔细阅读并充分理解本协议，并征得监护人的同意后使用本产品及相关服务。
          </p>
          <p>
            本公司有权根据需要不定时地制定、修改本协议或各类规则，经修订的协议、规则一经公布，立即自动生效。对新协议、规则生效之后注册的用户发生法律效力，对于协议、规则生效之前注册的用户，若用户在新规则生效后继续使用本产品提供的各项服务，则表明用户已充分阅读并认可和同意遵守新的协议或规则。若用户拒绝接受新的协议和规则，用户有权放弃或终止继续使用本产品提供的各项服务，但该用户应承担在本产品已经进行的交易下所应承担的任何法律责任，且应遵循该用户发生交易时有效的协议或规则内容。
          </p>
        </section>

        <!-- 定义与解释 -->
        <section class="content-section" id="definitions">
          <h2>一、定义与解释</h2>

          <div
            v-for="definition in definitions"
            :key="definition.id"
            class="definition-item"
          >
            <h3>{{ definition.title }}</h3>
            <p>{{ definition.content }}</p>
          </div>
        </section>

        <!-- 关于账号 -->
        <section class="content-section" id="account">
          <h2>二、关于"账号"</h2>

          <div class="subsection">
            <h3>1、账号的注册</h3>
            <ol>
              <li v-for="item in accountRegistration" :key="item.id">
                <span class="highlight" v-if="item.highlight">{{
                  item.highlight
                }}</span>
                {{ item.content }}
              </li>
            </ol>
          </div>

          <div class="subsection">
            <h3>2、账号使用</h3>
            <ol>
              <li v-for="item in accountUsage" :key="item.id">
                <span class="highlight" v-if="item.highlight">{{
                  item.highlight
                }}</span>
                {{ item.content }}
              </li>
            </ol>
          </div>

          <div class="subsection">
            <h3>3、账号的注销</h3>
            <p>{{ accountCancellation }}</p>
          </div>
        </section>

        <!-- 服务内容 -->
        <section class="content-section" id="services">
          <h2>三、本产品服务内容</h2>

          <div class="subsection">
            <h3>1、服务形式</h3>
            <p>{{ serviceForm }}</p>
          </div>

          <div class="subsection">
            <h3>2、服务内容</h3>
            <ol>
              <li v-for="item in serviceContent" :key="item.id">
                {{ item.content }}
              </li>
            </ol>
          </div>

          <div class="subsection">
            <h3>3、服务费用</h3>
            <ol>
              <li v-for="item in serviceFees" :key="item.id">
                <span class="highlight" v-if="item.highlight">{{
                  item.highlight
                }}</span>
                {{ item.content }}
              </li>
            </ol>
          </div>
        </section>

        <!-- 用户使用规范 -->
        <section class="content-section" id="usage-rules">
          <h2>四、用户使用规范</h2>

          <div class="subsection">
            <ol>
              <li v-for="item in usageRules" :key="item.id">
                <span class="highlight" v-if="item.highlight">{{
                  item.highlight
                }}</span>
                {{ item.content }}
              </li>
            </ol>
          </div>
        </section>

        <!-- 联系我们 -->
        <section class="content-section" id="contact">
          <h2>十四、通知和送达</h2>
          <p>
            您在使用本产品过程中有任何意见或建议，可通过本产品内【意见反馈】提出，我们将向您及时做出反馈。您应保证您的联系方式畅通，以接收来自我们发出的电话或信息，我们不对您未收到通知而引起的任何损失承担责任。
          </p>

          <div class="contact-info">
            <p><strong>电话：</strong>010-85591566</p>
            <p>
              <strong>地址：</strong>北京市朝阳区东三环中路20号乐成中心B座11层
            </p>
          </div>

          <p>
            为保障我们高效处理您的问题并及时向您反馈，需要您提交身份证明、有效联系方式和书面请求及相关证据，我们会在验证您的身份后处理您的请求。一般情况下，我们将在三十天内回复。
          </p>
        </section>

        <!-- 其他 -->
        <section class="content-section" id="other">
          <h2>十五、其他</h2>
          <ol>
            <li v-for="item in otherTerms" :key="item.id">
              {{ item.content }}
            </li>
          </ol>
        </section>
      </main>
    </div>

    <!-- 回到顶部按钮 -->
    <button
      v-if="showBackToTop"
      class="back-to-top"
      @click="scrollToTop"
      aria-label="回到顶部"
    >
      ↑
    </button>

    <!-- 接受协议按钮 -->
    <!-- <div class="accept-container" v-if="showAcceptButton">
      <div class="accept-box">
        <p>我已阅读并同意《彩虹一修平台用户服务协议》</p>
        <button class="accept-button" @click="acceptTerms">同意并继续</button>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"
defineOptions({ name: "Protocol" })
// 响应式数据
const publishDate = ref("2023年11月01日")
const effectiveDate = ref("2023年11月01日")
const showBackToTop = ref(false)
const isNavFixed = ref(false)
const activeSection = ref("")
const showAcceptButton = ref(true)

// 目录导航数据
const sections = ref([
  { id: "intro", title: "引言" },
  { id: "definitions", title: "一、定义与解释" },
  { id: "account", title: '二、关于"账号"' },
  { id: "services", title: "三、本产品服务内容" },
  { id: "usage-rules", title: "四、用户使用规范" },
  { id: "contact", title: "十四、通知和送达" },
  { id: "other", title: "十五、其他" },
])

// 定义与解释数据
const definitions = ref([
  {
    id: 1,
    title: "1、彩虹一修平台",
    content:
      "是指由彩虹（和/或其关联公司、附属公司）通过互联网提供的语音技术、图像技术、文字识别、人脸与人体识别、自然语言处理等服务的平台。",
  },
  {
    id: 2,
    title: "2、用户",
    content:
      '本协议中的"用户"指在阅读本协议后选择接受本协议全部条款的使用者，用户可通过游客方式访问、浏览本产品的部分服务，若用户选择注册、登录或选择其他第三方登录的方式使用本产品的，也可以在注册登陆后使用本产品的服务。',
  },
  {
    id: 3,
    title: "3、关联公司",
    content:
      '指任何直接或间接控制本公司、受本公司控制或与本公司受共同控制的任何一方。此处的"控制"和"受控制"分别指通过投票权或其他方式而督导某一方的管理政策的权利。',
  },
  {
    id: 4,
    title: "4、平台规则",
    content:
      "指已在或后续将在平台发布的各类规则、规范、公告、说明、解读、声明、指引或其他类似内容，具体以平台实际展示为准。",
  },
  {
    id: 5,
    title: "5、账号",
    content:
      "账号指用户用过本产品注册流程获取的用于标识用户的虚拟符号，用户可以在注册账号中设置相应的密码，该用户账号和密码由用户自行负责保管使用，并对其用户账号下的所有行为负法律责任。",
  },
  {
    id: 6,
    title: "6、账号信息",
    content:
      "用户在本产品中注册、使用的名称、头像、封面、简介、签名、认证信息等用于标识用户账号的信息。",
  },
])

// 账号注册数据
const accountRegistration = ref([
  {
    id: 1,
    highlight: "账号注册方式",
    content:
      "您使用本产品可以自行申请注册账户进行授权登录，您的账号为您注册使用的手机号，通过账号+验证码方式注册和登录，您设置的账号您用以登录并以注册用户身份使用本产品的凭证。",
  },
  {
    id: 2,
    highlight: "账号合规要求",
    content:
      "您理解并承诺，您所设置的账号不得违反国家法律法规及本公司的相关平台规则，您的账号名称、头像和简介等注册信息及其他个人信息若含有职业信息的，应当与您个人真实职业信息相一致。",
  },
  {
    id: 3,
    highlight: "手机验证",
    content:
      "您应保证注册/登录账号时需填写有效的手机号码，并使用手机验证短信来完成账户注册。若因您填写的手机号码不完整或不准确，则可能无法使用本产品或在使用过程中受到限制。",
  },
  {
    id: 4,
    highlight: "信息真实性",
    content:
      "您应保证您注册时提供的信息的真实性，请您在注册、管理账号时使用真实、准确、合法、有效的相关信息认证材料及必要信息。",
  },
])

// 账号使用数据
const accountUsage = ref([
  {
    id: 1,
    highlight: "账号使用权",
    content:
      "您在本产品中的注册账号所有权及有关权益均归本公司所有，您完成注册手续后仅享有该账号的使用权，您应当正确、适当地使用、运营、管理本产品账号。",
  },
  {
    id: 2,
    highlight: "账号安全",
    content:
      "您有责任维护您的个人账号的安全性与保密性，并对您以注册账号名义所从事的活动承担全部法律责任，包括但不限于您通过本产品上进行的任何数据修改、言论发表等操作行为。",
  },
  {
    id: 3,
    highlight: "账号找回",
    content:
      "您的账号在丢失后，可遵照本公司的申诉途径及时申诉请求找回账号。您理解并认可，本公司的账号找回机制仅需要识别申诉单上所填资料与系统记录资料具有一致性。",
  },
  {
    id: 4,
    highlight: "账号保管",
    content:
      "本公司特别提醒您应妥善保管您的账号。当您使用完毕后，应安全退出。因您保管不当可能导致遭受盗号，责任由您自行承担。",
  },
])

const accountCancellation = ref(
  "您有权注销您的账号，您可以根据本协议所述的方式联系我们的客服协助您注销账号。我们收到您的请求后需要您提供账号（手机号码）以及短信验证码，以核对身份，核验成功后我们将在15个工作日内为您完成注销。为了保障安全，我们可能需要您提供相应方式证明您的身份和请求的正当性。您注销成功后，我们将根据法律法规的要求尽快删除您的个人信息或作匿名化处理。"
)

// 服务内容数据
const serviceForm = ref(
  "您可能可以通过电脑、手机等终端以网页、客户端等形式使用本产品，具体以本公司提供的为准，同时，本公司会不断丰富您使用本软件的终端、形式等。当您使用本产品时，您应选择与您的终端、系统等相匹配的本产品版本，否则，您可能无法正常使用本产品。"
)

const serviceContent = ref([
  {
    id: 1,
    content: "AI能力：语音识别、语音合成、自然语言处理、文字识别等AI产品服务。",
  },
  { id: 2, content: "解决方案：智能维修、智能客服等" },
  {
    id: 3,
    content:
      "用户同意，本公司保留新增服务，变更、中止或终止提供以上服务的权利。",
  },
])

const serviceFees = ref([
  {
    id: 1,
    highlight: "收费服务",
    content:
      "本产品的某些服务是以收费方式提供的，如您使用收费服务，请遵守服务相关的协议。",
  },
  {
    id: 2,
    highlight: "收费标准",
    content:
      "本公司有权决定收费类服务的收费标准，具体的收费标准以本产品相关收费服务页面公布的标准为准，用户可以根据需要自行选择并付费使用相应服务。",
  },
  {
    id: 3,
    highlight: "支付方式",
    content:
      "您理解并同意，您支付前述费用的方式将通过我们接入的第三方支付工具（如微信支付、支付宝等）向我们进行付款。",
  },
  {
    id: 4,
    highlight: "费用不退",
    content:
      "您理解并同意，若您已经根据本产品中公布的费用标准完成了付款，除因您购买的相应收费类服务出现侵权纠纷原因导致您无法正常使用该服务外，我们不会退还您为使用该服务而支付的款项，且本公司无须承担任何责任。",
  },
])

// 用户使用规范数据
const usageRules = ref([
  {
    id: 1,
    highlight: "非商业使用",
    content:
      "本公司授权您非商业性使用本产品，但是如果要进行商业性使用（包括但不限于：销售、复制、散发、预装、捆绑或用于其他商业活动）时，必须事先获得本公司的书面授权和许可。",
  },
  {
    id: 2,
    highlight: "意见反馈",
    content:
      "您可以就本产品的下载、安装、使用或卸载问题向本公司提出咨询，本公司解答的义务不应超过本公司的合理承受限度。",
  },
  {
    id: 3,
    highlight: "内容责任",
    content:
      "用户充分了解并同意，本产品的用户上传、分享、传播的信息，均不代表本公司的观点，本公司对此不承担任何责任。",
  },
  {
    id: 4,
    highlight: "知识产权",
    content:
      "您不得修改、复制、传播与本产品相关的材料。如果您复制和修改传播这些材料，因此而造成对其他人的损害，或者造成对本公司的形象损害，要承担相应的法律责任。",
  },
])

// 其他条款数据
const otherTerms = ref([
  {
    id: 1,
    content:
      "本协议的订立、执行和解释及争议的解决均应适用中国法律并受中国法院管辖。如双方就本协议内容或其执行发生任何争议，双方应尽量友好协商解决；协商不成时，任何一方均可向本公司所在地的人民法院提起诉讼。",
  },
  {
    id: 2,
    content:
      "本协议构成双方对本协议之约定事项及其他有关事宜的完整协议，除本协议规定的之外，未赋予本协议各方其他权利。",
  },
  {
    id: 3,
    content:
      "如本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，本协议的其余条款仍应有效并且有约束力。",
  },
  {
    id: 4,
    content:
      "本服务仅限于在中国大陆地区使用，如您擅自在中国大陆以外（特别是欧盟）地区使用，公司不承担因此而产生的任何责任。",
  },
  {
    id: 5,
    content:
      "本协议自用户同意勾选或网上签署并成功注册成为本平台用户之日起生效，除非本公司终止本协议或者用户丧失本平台用户资格，否则本协议始终有效。",
  },
])

// 方法
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const offset = 100 // 导航栏高度偏移
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    })
  }
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

const acceptTerms = () => {
  // 这里可以添加接受协议后的逻辑
  alert("您已同意服务协议，可以继续使用我们的服务")
  showAcceptButton.value = false
}

const handleScroll = () => {
  showBackToTop.value = window.pageYOffset > 300
  isNavFixed.value = window.pageYOffset > 200

  // 更新当前激活的章节
  const sections = document.querySelectorAll(".content-section")
  let currentSection = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150
    if (window.pageYOffset >= sectionTop) {
      currentSection = section.id
    }
  })

  activeSection.value = currentSection
}

// 生命周期
onMounted(() => {
  window.addEventListener("scroll", handleScroll)
})

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
})
</script>

<style scoped>
.terms-of-service {
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.header {
  background: #fff;
  color: #000;
  padding: 2rem 1rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 10px;
}

.header h1 {
  margin: 0 0 1rem 0;
  font-size: 1.8rem;
}

.last-update {
  font-size: 0.9rem;
  opacity: 0.9;
}

.container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  /* padding: 1rem; */
  gap: 2rem;
}

.toc-nav {
  flex: 0 0 250px;
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: fit-content;
  transition: all 0.3s;
}

.toc-nav.fixed-nav {
  position: fixed;
  top: 1rem;
  width: 250px;
  z-index: 100;
}

.toc-nav h3 {
  margin-top: 0;
  color: #f46205;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.toc-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-nav li {
  margin-bottom: 0.8rem;
}

.toc-nav a {
  color: #555;
  text-decoration: none;
  transition: color 0.3s;
  display: block;
  padding: 0.3rem 0;
  border-left: 3px solid transparent;
  padding-left: 0.5rem;
}

.toc-nav a:hover,
.toc-nav a.active {
  color: #f46205;
  border-left-color: #f46205;
}

.content {
  flex: 1;
}

.content-section {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  scroll-margin-top: 1rem;
}

.content-section h2 {
  color: #f46205;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.8rem;
  margin-top: 0;
}

.content-section h3 {
  color: #555;
  margin-top: 1.5rem;
}

.content-section h4 {
  color: #666;
  margin-top: 1.2rem;
}

.definition-item {
  margin-bottom: 1.5rem;
}

.subsection {
  margin-top: 1.5rem;
}

.subsubsection {
  margin-top: 1rem;
  margin-left: 1rem;
}

.highlight {
  font-weight: bold;
  color: #e74c3c;
}

.contact-info {
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1.5rem 0;
}

.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f46205;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
  z-index: 1000;
}

.back-to-top:hover {
  background-color: #2980b9;
  transform: translateY(-3px);
}

.accept-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  padding: 1rem;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.accept-box {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.accept-button {
  background-color: #f46205;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.accept-button:hover {
  background-color: #2980b9;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    /* padding: 0.5rem; */
    gap: 1rem;
  }

  .toc-nav {
    position: static;
    flex: none;
  }

  .toc-nav.fixed-nav {
    position: static;
    width: auto;
  }

  .content-section {
    padding: 1.5rem;
  }

  .header {
    padding: 1.5rem 1rem;
  }

  .header h1 {
    font-size: 1.5rem;
  }

  .back-to-top {
    bottom: 1rem;
    right: 1rem;
    width: 45px;
    height: 45px;
  }

  .accept-box {
    flex-direction: column;
    text-align: center;
  }
}
</style>
