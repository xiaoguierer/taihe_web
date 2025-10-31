<template>
  <div class="policy-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载政策文件...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>加载失败</h3>
      <p>{{ error }}</p>
      <button @click="fetchPolicy" class="retry-btn">重新加载</button>
    </div>

    <!-- 政策内容 -->
    <div v-else-if="policy" class="policy-content-wrapper">
      <!-- 政策文件头部信息 -->
      <div class="policy-header">
        <h1 class="policy-title">{{ policy.title }}</h1>
      </div>

      <!-- 政策文件内容 -->
      <div class="policy-content">
        <div
          class="html-content"
          v-html="policy.content"
          ref="htmlContent"
        ></div>
      </div>

      <!-- 政策文件附件 -->
      <div class="policy-attachments" v-if="policy.attachments && policy.attachments.length">
        <h3 class="attachments-title">附件</h3>
        <ul class="attachments-list">
          <li
            v-for="(attachment, index) in policy.attachments"
            :key="index"
            class="attachment-item"
          >
            <a
              :href="attachment.url"
              target="_blank"
              class="attachment-link"
              @click.prevent="downloadAttachment(attachment)"
            >
              <span class="attachment-icon">📎</span>
              {{ attachment.name }}
              <span class="attachment-size" v-if="attachment.size">({{ formatFileSize(attachment.size) }})</span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-container">
      <p>暂无政策内容</p>
    </div>
  </div>
</template>

<script>
// 可以根据实际情况引入axios或其他HTTP客户端
// import axios from 'axios';

export default {
  name: 'Service',
  props: {
    // 政策ID，用于从API获取特定政策
    policyId: {
      type: [String, Number],
      default: null
    },
    // 直接传递API地址
    apiUrl: {
      type: String,
      default: ''
    },
    // 或者传递完整的API配置
    apiConfig: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      error: null,
      policy: null
    }
  },
  computed: {
    // 计算最终的API地址
    finalApiUrl() {
      if (this.apiUrl) return this.apiUrl;

      // 这里可以根据实际情况构建API地址
      const baseUrl = this.apiConfig.baseUrl || '/api';
      const endpoint = this.apiConfig.endpoint || '/policy';
      const id = this.policyId || this.apiConfig.id;

      return id ? `${baseUrl}${endpoint}/${id}` : `${baseUrl}${endpoint}`;
    }
  },
  methods: {
    // 获取政策数据
    async fetchPolicy() {
      this.loading = true;
      this.error = null;

      try {
        // 实际项目中替换为真实的API调用
        // const response = await axios.get(this.finalApiUrl);
        // this.policy = response.data;

        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 800));

        // 模拟数据 - 实际项目中删除这部分
        this.policy = await this.mockApiCall();

      } catch (err) {
        console.error('获取政策数据失败:', err);
        this.error = err.message || '网络错误，请稍后重试';
      } finally {
        this.loading = false;
      }
    },

    // 模拟API调用 - 实际项目中删除此方法
    async mockApiCall() {
      return {
        id: this.policyId || 1,
        title: '关于TAIHE服务的若干政策',
        content: `
          <h2>第一章 总则 -服务说明</h2>
          <p>第一条 为促进数字经济创新发展，推动经济高质量发展，根据国家相关法律法规，制定本政策。</p>
          <p>第二条 本政策适用于在本市行政区域内注册并纳税的各类企业、科研机构和社会组织。</p>
          <p>第三条 市数字经济局负责本政策的组织实施和解释工作。</p>
          <h2>第二章 支持措施</h2>
          <p>第四条 对符合条件的数字经济企业给予以下支持：</p>
          <ul>
            <li>资金扶持：按照企业实际投资额的10%给予一次性资金支持，最高不超过500万元；</li>
            <li>税收优惠：前三年按缴纳额的50%给予奖励；</li>
            <li>人才支持：对核心技术人员给予每人每年5万元的工作津贴。</li>
          </ul>
          <p>第五条 鼓励企业加大研发投入，对研发费用占销售收入比例超过5%的企业，给予额外奖励。</p>
          <table border="1" style="width:100%">
            <tr>
              <th>企业类型</th>
              <th>研发比例要求</th>
              <th>奖励标准</th>
            </tr>
            <tr>
              <td>大型企业</td>
              <td>>5%</td>
              <td>研发费用的5%</td>
            </tr>
            <tr>
              <td>中小企业</td>
              <td>>8%</td>
              <td>研发费用的8%</td>
            </tr>
          </table>
          <h2>第三章 附则</h2>
          <p>第六条 本政策自发布之日起施行，有效期三年。</p>
          <p>第七条 本政策由市数字经济局负责解释。</p>
        `,
        attachments: [
          {
            name: '实施细则.pdf',
            url: '/api/attachments/1.pdf',
            size: 2048576
          },
          {
            name: '申报指南.docx',
            url: '/api/attachments/2.docx',
            size: 512000
          }
        ]
      };
    },

    // 格式化日期
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    },

    // 格式化文件大小
    formatFileSize(bytes) {
      if (!bytes) return '';
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / 1048576).toFixed(1) + ' MB';
    },

    // 处理HTML内容中的图片自适应
    processImages() {
      this.$nextTick(() => {
        const contentElement = this.$refs.htmlContent;
        if (contentElement) {
          const images = contentElement.querySelectorAll('img');
          images.forEach(img => {
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
          });
        }
      });
    },

    // 下载附件
    downloadAttachment(attachment) {
      // 实际项目中实现附件下载逻辑
      console.log('下载附件:', attachment);
      // 示例：在新窗口打开或使用文件下载
      window.open(attachment.url, '_blank');
    }
  },
  watch: {
    // 监听政策ID变化，重新获取数据
    policyId: {
      handler(newId) {
        if (newId) {
          this.fetchPolicy();
        }
      },
      immediate: true
    },

    // 监听API URL变化
    apiUrl: {
      handler() {
        this.fetchPolicy();
      },
      immediate: true
    },

    // 监听政策内容变化，处理图片自适应
    'policy.content': {
      handler() {
        this.processImages();
      },
      immediate: true
    }
  },
  mounted() {
    this.processImages();
  }
}
</script>

<style scoped>
.policy-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  min-height: 400px;
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态样式 */
.error-container {
  text-align: center;
  padding: 60px 20px;
  color: #f5222d;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.retry-btn {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.retry-btn:hover {
  background-color: #40a9ff;
}

/* 空状态样式 */
.empty-container {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

/* 政策内容样式 */
.policy-header {
  padding-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 30px;
}

.policy-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 15px;
  text-align: center;
  line-height: 1.4;
}

.policy-meta {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 14px;
  color: #666;
}

.policy-meta span {
  white-space: nowrap;
}

.policy-content {
  margin-bottom: 30px;
}

.html-content {
  font-size: 16px;
  line-height: 1.8;
}

/* 处理HTML内容中的元素样式 */
.html-content ::v-deep h1,
.html-content ::v-deep h2,
.html-content ::v-deep h3,
.html-content ::v-deep h4,
.html-content ::v-deep h5,
.html-content ::v-deep h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.html-content ::v-deep h1 {
  font-size: 1.8em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.html-content ::v-deep h2 {
  font-size: 1.5em;
}

.html-content ::v-deep h3 {
  font-size: 1.25em;
}

.html-content ::v-deep p {
  margin-bottom: 16px;
  text-align: justify;
}

.html-content ::v-deep ul,
.html-content ::v-deep ol {
  padding-left: 2em;
  margin-bottom: 16px;
}

.html-content ::v-deep li {
  margin-bottom: 8px;
}

.html-content ::v-deep table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 16px;
}

.html-content ::v-deep th,
.html-content ::v-deep td {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: left;
}

.html-content ::v-deep th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.html-content ::v-deep blockquote {
  margin: 16px 0;
  padding: 0 16px;
  border-left: 4px solid #ddd;
  background-color: #f9f9f9;
  color: #666;
}

.html-content ::v-deep a {
  color: #1890ff;
  text-decoration: none;
}

.html-content ::v-deep a:hover {
  text-decoration: underline;
}

/* 附件样式 */
.policy-attachments {
  padding-top: 20px;
  border-top: 1px solid #eaeaea;
}

.attachments-title {
  font-size: 18px;
  margin-bottom: 15px;
  font-weight: 600;
}

.attachments-list {
  list-style: none;
  padding-left: 0;
}

.attachment-item {
  margin-bottom: 10px;
}

.attachment-link {
  display: inline-flex;
  align-items: center;
  color: #1890ff;
  text-decoration: none;
  transition: color 0.3s;
}

.attachment-link:hover {
  color: #40a9ff;
  text-decoration: underline;
}

.attachment-icon {
  margin-right: 8px;
  font-size: 16px;
}

.attachment-size {
  margin-left: 8px;
  color: #999;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .policy-container {
    padding: 15px;
    margin: 10px;
    border-radius: 4px;
  }

  .policy-title {
    font-size: 20px;
  }

  .policy-meta {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .html-content {
    font-size: 15px;
  }

  .html-content ::v-deep h1 {
    font-size: 1.6em;
  }

  .html-content ::v-deep h2 {
    font-size: 1.3em;
  }

  .html-content ::v-deep h3 {
    font-size: 1.1em;
  }

  .html-content ::v-deep table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}

@media (max-width: 480px) {
  .policy-container {
    padding: 10px;
    margin: 5px;
  }

  .policy-title {
    font-size: 18px;
  }

  .html-content {
    font-size: 14px;
  }

  .html-content ::v-deep h1 {
    font-size: 1.4em;
  }
}
</style>
