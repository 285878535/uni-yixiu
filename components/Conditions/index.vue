<template>
  <div class="privacy-policy">
    <header class="header">
      <h1>彩虹一修平台隐私政策</h1>
      <div class="last-update">
        <p>更新日期：{{ updateDate }}</p>
        <p>生效日期：{{ effectiveDate }}</p>
      </div>
    </header>

    <div class="container">
      <!-- 目录导航 -->
      <nav class="toc-nav">
        <h3>目录导航</h3>
        <ul>
          <li v-for="section in sections" :key="section.id">
            <a :href="`#${section.id}`" @click="scrollToSection(section.id)">
              {{ section.title }}
            </a>
          </li>
        </ul>
      </nav>

      <!-- 主要内容 -->
      <main class="content">
        <!-- 特别说明 -->
        <section class="content-section" id="special-notice">
          <h2>特别说明</h2>
          <p>
            《彩虹一修平台隐私政策》（以下简称"本政策"）仅适用于彩虹无线（北京）新技术有限公司（以下简称"彩虹无线"或"我们"）为您提供的彩虹一修平台产品与/或服务。您在使用本软件前，请仔细阅读本政策，以了解我们处理您个人信息的详情。其中有关个人敏感信息以及与您个人信息权益相关的重要内容我们已用加粗形式提示，请特别关注。如您是未满14周岁的未成年人，请在您的父母或其他监护人陪同下仔细阅读并充分理解本政策，并征得您的父母或其他监护人的同意后使用彩虹一修平台产品与/或服务。
          </p>

          <ol>
            <li>
              本政策适用对象为访问、注册、登录及使用彩虹一修平台产品与/或服务的访问者和开发者，以及使用调用了彩虹一修平台人工智能API/SDK产品与/或服务最终用户。
            </li>
            <li>
              如开发者将彩虹一修平台提供的产品与/或服务集成到其自行开发的产品与/或服务中并向最终用户提供，或以任何其他形式使用彩虹一修平台提供的产品与/或服务并向最终用户提供，则开发者应承诺：
              <ol>
                <li>
                  处理最终用户个人信息的过程中，遵守可适用的法律法规和国家规范性文件，包括但不限于《中华人民共和国网络安全法》《中华人民共和国数据安全法》《中华人民共和国个人信息保护法》《App违法违规收集使用个人信息行为认定方法》《GB/T35273-2020信息安全技术个人信息安全规范》等。
                </li>
                <li>
                  向最终用户告知自身的产品与/或服务中使用了彩虹无线提供的产品与/或服务，且最终用户的个人信息会共享至彩虹无线，包括告知共享的目的、共享方式和共享的个人信息种类。同时，开发者可以在使用彩虹一修平台产品与/或服务的隐私政策中提供一个链接，使其指向本政策。
                </li>
                <li>
                  获得最终用户充分、必要且明确的授权、同意和许可，允许我们在符合相关法律法规的前提下可将收集、处理的信息用于本政策列明的服务用途。
                </li>
                <li>
                  已向最终用户提供易于操作的用户权利实现机制，包括告知最终用户如何行使知情、查阅、复制、更正、删除、补充、转移等可适用法律法规要求的各项权利。
                </li>
              </ol>
            </li>
            <li>
              本政策阐述了我们如何处理个人信息的详情，但不覆盖调用了彩虹一修平台产品与/或服务的第三方产品与服务处理个人信息的全部场景。虽然第三方调用了我们的产品与/或服务，但我们并不了解或控制其具体的使用行为，因此也不为其行为负责；如您是使用调用了彩虹一修平台产品与/或服务的最终用户，我们建议您在已查看并同意其隐私政策之前，谨慎访问或使用其产品与服务。
            </li>
          </ol>
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

        <!-- 信息收集和使用 -->
        <section class="content-section" id="collection-use">
          <h2>二、我们如何收集和使用您的个人信息</h2>
          <p>
            彩虹一修平台通过互联网方式向您提供人工智能产品能力服务与解决方案，您可以通过彩虹一修平台获取、购买彩虹无线人工智能服务SDK与/或API接口。彩虹无线作为个人信息的处理者，会遵循合法、正当、必要、诚信的原则，仅将您主动提供的个人信息和我们主动收集的个人信息用于本政策所限定的收集个人信息的使用用途并与实现产品或服务的业务功能有直接关联，以为您提供开放平台优质的产品与/或服务。以及用于身份验证、安全防范、反诈骗监测、存档备份、客户的安全服务用途以提高产品和服务的安全性。具体地，我们将出于如下所述的目的收集和使用您的个人信息。
          </p>

          <div class="subsection">
            <h3>1. 向您提供产品与/或服务过程中您主动提供的个人信息</h3>

            <div class="subsubsection">
              <h4>
                1.1
                当您是访问、注册、登录及使用彩虹一修平台产品与/或服务的访问者和开发者时：
              </h4>
              <ol>
                <li v-for="item in collectionItems1" :key="item.id">
                  <span class="highlight">{{ item.title }}</span
                  >：{{ item.content }}
                </li>
              </ol>
            </div>

            <div class="subsubsection">
              <h4>
                1.2
                当您是使用调用了彩虹一修平台人工智能API/SDK的产品或服务的最终用户时：
              </h4>
              <p>
                <span class="highlight">语音、图像和文本输入</span>：{{
                  collectionItems2
                }}
              </p>
            </div>
          </div>
        </section>

        <!-- 联系我们 -->
        <section class="content-section" id="contact">
          <h2>十一、如何联系我们</h2>
          <p>
            为更好地保护您的个人信息，我们设立有专门的网络安全与个人信息保护部门。如您在使用彩虹一修平台的过程中对本隐私政策有任何疑问或建议，请通过以下联系方式与我们联系：
          </p>

          <div class="contact-info">
            <p><strong>电话：</strong>010-85591566</p>
            <p>
              <strong>邮箱：</strong
              ><a href="mailto:contactus@cihon.cn">contactus@cihon.cn</a>
            </p>
            <p>
              <strong>地址：</strong>北京市朝阳区东三环中路20号乐成中心B座11层
            </p>
          </div>

          <p>
            为保障我们高效处理您的问题并及时向您反馈，需要您提交身份证明、有效联系方式和书面请求及相关证据，我们会在验证您的身份后处理您的请求。一般情况下，我们将在十五个工作日内回复。
          </p>
          <p>
            如果您对我们的回复不满意，特别是您认为我们的个人信息处理行为损害了且在您向我们反馈后我们无法提供让您满意的回复且拒绝改进的，您可以向相关监管机构进行投诉和举报。
          </p>
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
  </div>
</template>

<script setup>
defineOptions({ name: "Conditions" })
import { ref, onMounted, onUnmounted } from "vue"

// 响应式数据
const updateDate = ref("2023年11月01日")
const effectiveDate = ref("2023年11月01日")
const showBackToTop = ref(false)

// 目录导航数据
const sections = ref([
  { id: "special-notice", title: "特别说明" },
  { id: "definitions", title: "一、定义与解释" },
  { id: "collection-use", title: "二、我们如何收集和使用您的个人信息" },
  { id: "contact", title: "十一、如何联系我们" },
])

// 定义与解释数据
const definitions = ref([
  {
    id: 1,
    title: "1. 彩虹一修平台产品与/或服务",
    content:
      "包括彩虹一修平台网站，及彩虹一修平台人工智能API/SDK产品所提供的语音识别、语音合成、语音分析、自然语言处理、图像识别、人脸识别、语音硬件、文字识别、汽车维修、基础服务、A.I.开发栈、A.I.百宝箱能力与人工智能相关解决方案。",
  },
  {
    id: 2,
    title: "2. 彩虹无线（北京）新技术有限公司",
    content:
      "彩虹一修平台产品与/或服务的经营者，专业从事智能语音及语言技术研究、软件及芯片产品开发、语音信息服务及电子政务系统集成。注册地址/常用办公地址：北京市朝阳区东三环中路20号乐成中心B座11层，联系电话：010-85591566；如您想要更详细的了解我们公司、平台，您可以通过本政策第十一章提供的联系方式与我们联系。",
  },
  {
    id: 3,
    title: "3. 关联公司",
    content:
      '指任何直接或间接控制彩虹无线、受彩虹无线控制或与彩虹无线受共同控制的任何一方。此处的"控制"和"受控制"分别指通过投票权、合同或其他方式而督导某一方的管理政策的权利。',
  },
  {
    id: 4,
    title: "4. 用户",
    content:
      '是指访问彩虹一修平台网站，注册、登录以及使用彩虹一修平台产品与/或服务，并通过启用、浏览或上传数据至彩虹一修平台的访问者和开发者，以及使用调用了彩虹一修平台人工智能API/SDK产品与/或服务的最终用户。在本政策中更多地称为"您"。',
  },
])

// 信息收集和使用数据
const collectionItems1 = ref([
  {
    id: 1,
    title: "账号注册/登录及使用",
    content:
      "如果您选择使用彩虹一修平台的功能，为便于使用我们为您提供的完整的开放平台产品与/或服务，您需要注册一个彩虹一修平台账号。在您使用手机号注册或登录彩虹一修平台账号时，您需要提供手机号码并设置登录密码，并且通过输入短信验证码，以便我们对您的用户身份进行核验，以保护您的账号不被未经授权的进入。如果您仅需使用输入、查看、搜索等访问相关服务，您不需要注册彩虹一修平台账号及提供上述个人信息。",
  },
  {
    id: 2,
    title: "实名认证",
    content:
      "当您使用彩虹一修平台提供的部分产品与/或服务时，根据相关法律法规要求，需要您进行实名认证。实名认证需要上传实名认证信息。不同的实名认证主体类型会要求不同实名认证信息，这些信息包括：姓名、证件号码、公司名称、公司统一信用代码、公司注册地址、组织机构信息、学生证信息、身份证信息、项目信息、创始人信息、商业计划书。上述信息将仅在您使用彩虹一修平台提供的产品与/或服务期间持续授权彩虹一修平台保存使用。在您主动注销账号时，我们将根据适用法律法规的要求尽快使其匿名或删除您的个人信息。",
  },
  {
    id: 3,
    title: "语音、图像和文本输入",
    content:
      "在您使用彩虹一修平台网站提供的语音合成、语音听写、语音转写、文字识别、图像识别、翻译的在线体验服务时，我们会收集您的输入的语音内容、文本信息、图像信息，因为收集是实现上述功能所必需的。同时，我们会收集语音转写后的文本信息，判断您的需求并做出实时处理反馈给您，以方便您了解进行了哪些语音交互、便于为您提供记录查看和效果分析服务。我们对您的语音做出实时处理并反馈给您。",
  },
])

const collectionItems2 = ref(
  "在您使用集成了彩虹一修平台提供的语音合成、语音听写、语音转写、文字识别、图像识别、翻译功能等功能的产品时，我们会收集您的语音内容、文本信息、图像信息，因为收集是实现上述功能所必需的。同时，我们会收集语音转写后的文本信息，判断您的需求并做出实时处理反馈给您，以方便您了解进行了哪些语音交互、便于为您提供记录查看和效果分析服务。我们对您的语音做出实时处理并反馈给您。请您知悉，您所输入的语音、文本内容中虽然可能包含您或他人的个人信息，但我们不会依据所涉个人信息的内容识别到个人，仅会通过提取字符串（不识别个人信息）的方式进行技术分析以实现输入功能。如果您拒绝输入前述信息，您将无法使用前述完整的功能。"
)

// 方法
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const offset = 80 // 导航栏高度偏移
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

const handleScroll = () => {
  showBackToTop.value = window.pageYOffset > 300
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
.privacy-policy {
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
  position: sticky;
  top: 1rem;
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
}

.toc-nav a:hover {
  color: #f46205;
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
}
</style>
