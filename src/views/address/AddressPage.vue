<template>
  <div class="address-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">收货地址管理</h1>
      <p class="page-subtitle">管理您的收货地址，确保商品准确送达</p>
    </div>

    <!-- 操作栏 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAddAddress" class="add-btn">
        <el-icon><Plus /></el-icon>
        新增地址
      </el-button>
      <div class="address-count">共 {{ addresses.length }} 个收货地址</div>
    </div>

    <!-- 地址列表 -->
    <div class="address-list">
      <div v-if="addresses.length === 0" class="empty-address">
        <div class="empty-icon">🏠</div>
        <div class="empty-text">您还没有添加收货地址</div>
        <div class="empty-subtext">添加地址后，结算时可直接选择</div>
        <el-button type="primary" @click="handleAddAddress">添加地址</el-button>
      </div>

      <!-- 地址卡片 -->
      <div
        v-for="address in addresses"
        :key="address.id"
        class="address-card"
        :class="{ 'default-address': address.is_default }"
      >
        <!-- 默认地址标识 -->
        <div v-if="address.is_default" class="default-badge">
          <el-icon><StarFilled /></el-icon>
          <span>默认地址</span>
        </div>

        <!-- 地址信息 -->
        <div class="address-info">
          <div class="recipient-info">
            <span class="recipient-name">{{ address.full_name }}</span>
            <span class="recipient-phone">+{{ address.phone_country_code }} {{ formatPhoneNumber(address.phone_number) }}</span>
          </div>

          <div class="address-detail">
            <div class="region-info">
              <span class="country">{{ getCountryName(address.country_code) }}</span>
              <span v-if="address.state_province" class="separator">/</span>
              <span v-if="address.state_province" class="state">{{ address.state_province }}</span>
              <span class="separator">/</span>
              <span class="city">{{ address.city }}</span>
              <span v-if="address.district_county" class="separator">/</span>
              <span v-if="address.district_county" class="district">{{ address.district_county }}</span>
            </div>
            <div class="street-address">
              {{ address.address_line1 }}
              <span v-if="address.address_line2">，{{ address.address_line2 }}</span>
            </div>
            <div v-if="address.postal_code" class="postal-code">
              邮政编码：{{ address.postal_code }}
            </div>
          </div>

          <!-- 地址标签 -->
          <div v-if="address.address_tag" class="address-tag">
            <el-tag :type="getTagType(address.address_tag)" size="small">
              {{ getTagText(address.address_tag) }}
            </el-tag>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="address-actions">
          <el-button
            type="primary"
            link
            @click="handleEditAddress(address)"
            class="action-btn"
          >
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>

          <el-button
            v-if="!address.is_default"
            type="primary"
            link
            @click="handleSetDefault(address.id)"
            class="action-btn"
          >
            <el-icon><Star /></el-icon>
            设为默认
          </el-button>

          <el-button
            type="danger"
            link
            @click="handleDeleteAddress(address)"
            class="action-btn"
            :disabled="addresses.length <= 1"
          >
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </div>
      </div>
    </div>

    <!-- 地址编辑对话框 -->
    <el-dialog
      v-model="showAddressDialog"
      :title="isEditing ? '编辑地址' : '新增地址'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="addressFormRef"
        :model="addressForm"
        :rules="addressRules"
        label-width="100px"
        class="address-form"
      >
        <el-form-item label="收件人" prop="full_name">
          <el-input
            v-model="addressForm.full_name"
            placeholder="请输入收件人姓名"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="手机号码" required>
          <div class="phone-input-group">
            <el-select
              v-model="addressForm.phone_country_code"
              placeholder="区号"
              style="width: 120px"
              class="country-code-select"
            >
              <el-option
                v-for="country in countryCodes"
                :key="country.code"
                :label="`${country.name} +${country.code}`"
                :value="country.code"
              />
            </el-select>
            <el-input
              v-model="addressForm.phone_number"
              placeholder="请输入手机号码"
              class="phone-number-input"
              @blur="validatePhoneNumber"
            />
          </div>
          <div v-if="phoneError" class="phone-error">{{ phoneError }}</div>
        </el-form-item>

        <el-form-item label="国家/地区" prop="country_code">
          <el-select
            v-model="addressForm.country_code"
            placeholder="请选择国家/地区"
            filterable
            @change="handleCountryChange"
            class="country-select"
          >
            <el-option
              v-for="country in countries"
              :key="country.code"
              :label="country.name"
              :value="country.code"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          :label="getRegionLabel(addressForm.country_code)"
          :prop="getRegionProp(addressForm.country_code)"
          :rules="getRegionRules(addressForm.country_code)"
        >
          <el-select
            v-if="shouldShowRegionSelect(addressForm.country_code)"
            v-model="addressForm.state_province"
            :placeholder="`请选择${getRegionLabel(addressForm.country_code)}`"
            filterable
            class="region-select"
          >
            <el-option
              v-for="region in getRegionsByCountry(addressForm.country_code)"
              :key="region.code"
              :label="region.name"
              :value="region.code"
            />
          </el-select>
          <el-input
            v-else
            v-model="addressForm.state_province"
            :placeholder="`请输入${getRegionLabel(addressForm.country_code)}`"
          />
        </el-form-item>

        <el-form-item label="城市" prop="city">
          <el-input
            v-model="addressForm.city"
            placeholder="请输入城市名称"
          />
        </el-form-item>

        <el-form-item
          v-if="shouldShowDistrict(addressForm.country_code)"
          label="区/县"
          prop="district_county"
        >
          <el-input
            v-model="addressForm.district_county"
            placeholder="请输入区/县名称"
          />
        </el-form-item>

        <el-form-item label="详细地址" prop="address_line1">
          <el-input
            v-model="addressForm.address_line1"
            placeholder="请输入街道、门牌号等详细地址"
            type="textarea"
            :rows="3"
          />
        </el-form-item>

        <el-form-item label="地址补充" prop="address_line2">
          <el-input
            v-model="addressForm.address_line2"
            placeholder="公寓、单元、公司名等（可选）"
          />
        </el-form-item>

        <el-form-item
          :label="getPostalCodeLabel(addressForm.country_code)"
          :prop="getPostalCodeProp(addressForm.country_code)"
          :rules="getPostalCodeRules(addressForm.country_code)"
        >
          <el-input
            v-model="addressForm.postal_code"
            :placeholder="`请输入${getPostalCodeLabel(addressForm.country_code)}`"
          />
        </el-form-item>

        <el-form-item label="地址标签">
          <el-radio-group v-model="addressForm.address_tag">
            <el-radio label="home">家</el-radio>
            <el-radio label="company">公司</el-radio>
            <el-radio label="other">其他</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-checkbox
            v-model="addressForm.set_as_default"
            :disabled="isEditing && currentAddress?.is_default"
          >
            设为默认地址
          </el-checkbox>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showAddressDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSaveAddress" :loading="saving">
          {{ isEditing ? '更新' : '保存' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="showDeleteConfirm"
      title="确认删除"
      width="400px"
    >
      <p>确定要删除这个收货地址吗？</p>
      <p class="delete-warning" v-if="addressToDelete?.is_default">
        <el-icon><Warning /></el-icon>
        此地址是默认地址，删除后将自动设置其他地址为默认
      </p>
      <template #footer>
        <el-button @click="showDeleteConfirm = false">取消</el-button>
        <el-button type="danger" @click="confirmDelete">确定删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Edit,
  Delete,
  Star,
  StarFilled,
  Warning
} from '@element-plus/icons-vue'

// 响应式数据
const showAddressDialog = ref(false)
const showDeleteConfirm = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const addressFormRef = ref()
const phoneError = ref('')
const addressToDelete = ref(null)
const currentAddress = ref(null)

// 地址表单数据
const addressForm = reactive({
  full_name: '',
  phone_country_code: '86',
  phone_number: '',
  country_code: 'CN',
  state_province: '',
  city: '',
  district_county: '',
  address_line1: '',
  address_line2: '',
  postal_code: '',
  address_tag: 'home',
  set_as_default: false
})

// 验证规则
const addressRules = reactive({
  full_name: [
    { required: true, message: '请输入收件人姓名', trigger: 'blur' },
    { min: 2, max: 50, message: '姓名长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  country_code: [
    { required: true, message: '请选择国家/地区', trigger: 'change' }
  ],
  city: [
    { required: true, message: '请输入城市名称', trigger: 'blur' }
  ],
  address_line1: [
    { required: true, message: '请输入详细地址', trigger: 'blur' }
  ]
})

// 模拟数据 - 国家列表
const countries = ref([
  { code: 'CN', name: '中国', hasState: true, hasDistrict: true, postalRequired: true },
  { code: 'US', name: '美国', hasState: true, hasDistrict: false, postalRequired: true },
  { code: 'GB', name: '英国', hasState: false, hasDistrict: false, postalRequired: true },
  { code: 'JP', name: '日本', hasState: true, hasDistrict: true, postalRequired: true },
  { code: 'AE', name: '阿联酋', hasState: false, hasDistrict: false, postalRequired: false },
  { code: 'SG', name: '新加坡', hasState: false, hasDistrict: false, postalRequired: true },
  { code: 'MY', name: '马来西亚', hasState: true, hasDistrict: false, postalRequired: true }
])

// 模拟数据 - 国际区号
const countryCodes = ref([
  { code: '86', name: '中国' },
  { code: '1', name: '美国/加拿大' },
  { code: '44', name: '英国' },
  { code: '81', name: '日本' },
  { code: '971', name: '阿联酋' },
  { code: '65', name: '新加坡' },
  { code: '60', name: '马来西亚' }
])

// 模拟数据 - 省份/州
const regions = ref({
  CN: [
    { code: 'BJ', name: '北京市' },
    { code: 'SH', name: '上海市' },
    { code: 'GD', name: '广东省' },
    { code: 'ZJ', name: '浙江省' },
    { code: 'JS', name: '江苏省' }
  ],
  US: [
    { code: 'CA', name: '加利福尼亚州' },
    { code: 'NY', name: '纽约州' },
    { code: 'TX', name: '德克萨斯州' },
    { code: 'FL', name: '佛罗里达州' }
  ],
  JP: [
    { code: 'Tokyo', name: '东京都' },
    { code: 'Osaka', name: '大阪府' },
    { code: 'Kyoto', name: '京都府' }
  ],
  MY: [
    { code: 'Kuala Lumpur', name: '吉隆坡' },
    { code: 'Selangor', name: '雪兰莪' },
    { code: 'Penang', name: '槟城' }
  ]
})

// 模拟地址数据
const addresses = ref([
  {
    id: '1',
    full_name: '张三',
    phone_country_code: '86',
    phone_number: '13800138000',
    country_code: 'CN',
    state_province: 'BJ',
    city: '北京市',
    district_county: '朝阳区',
    address_line1: '建国路88号SOHO现代城A座1001室',
    address_line2: '',
    postal_code: '100022',
    address_tag: 'home',
    is_default: true,
    created_at: '2023-10-01',
    updated_at: '2023-10-01'
  },
  {
    id: '2',
    full_name: '张三',
    phone_country_code: '86',
    phone_number: '13900139000',
    country_code: 'CN',
    state_province: 'SH',
    city: '上海市',
    district_county: '浦东新区',
    address_line1: '陆家嘴环路1000号',
    address_line2: '汇丰银行大厦',
    postal_code: '200120',
    address_tag: 'company',
    is_default: false,
    created_at: '2023-10-15',
    updated_at: '2023-10-15'
  },{
    id: '1',
    full_name: '张三',
    phone_country_code: '86',
    phone_number: '13800138000',
    country_code: 'CN',
    state_province: 'BJ',
    city: '北京市',
    district_county: '朝阳区',
    address_line1: '建国路88号SOHO现代城A座1001室',
    address_line2: '',
    postal_code: '100022',
    address_tag: 'home',
    is_default: true,
    created_at: '2023-10-01',
    updated_at: '2023-10-01'
  },
  {
    id: '2',
    full_name: '张三',
    phone_country_code: '86',
    phone_number: '13900139000',
    country_code: 'CN',
    state_province: 'SH',
    city: '上海市',
    district_county: '浦东新区',
    address_line1: '陆家嘴环路1000号',
    address_line2: '汇丰银行大厦',
    postal_code: '200120',
    address_tag: 'company',
    is_default: false,
    created_at: '2023-10-15',
    updated_at: '2023-10-15'
  },{
    id: '1',
    full_name: '张三',
    phone_country_code: '86',
    phone_number: '13800138000',
    country_code: 'CN',
    state_province: 'BJ',
    city: '北京市',
    district_county: '朝阳区',
    address_line1: '建国路88号SOHO现代城A座1001室',
    address_line2: '',
    postal_code: '100022',
    address_tag: 'home',
    is_default: true,
    created_at: '2023-10-01',
    updated_at: '2023-10-01'
  },
  {
    id: '2',
    full_name: '张三',
    phone_country_code: '86',
    phone_number: '13900139000',
    country_code: 'CN',
    state_province: 'SH',
    city: '上海市',
    district_county: '浦东新区',
    address_line1: '陆家嘴环路1000号',
    address_line2: '汇丰银行大厦',
    postal_code: '200120',
    address_tag: 'company',
    is_default: false,
    created_at: '2023-10-15',
    updated_at: '2023-10-15'
  }
])

// 计算属性
const defaultAddress = computed(() => {
  return addresses.value.find(addr => addr.is_default) || addresses.value[0]
})

// 方法
const handleAddAddress = () => {
  isEditing.value = false
  currentAddress.value = null
  resetAddressForm()
  showAddressDialog.value = true
}

const handleEditAddress = (address) => {
  isEditing.value = true
  currentAddress.value = address
  Object.assign(addressForm, {
    full_name: address.full_name,
    phone_country_code: address.phone_country_code,
    phone_number: address.phone_number,
    country_code: address.country_code,
    state_province: address.state_province,
    city: address.city,
    district_county: address.district_county,
    address_line1: address.address_line1,
    address_line2: address.address_line2,
    postal_code: address.postal_code,
    address_tag: address.address_tag,
    set_as_default: address.is_default
  })
  showAddressDialog.value = true
}

const handleSetDefault = async (addressId) => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    addresses.value.forEach(addr => {
      addr.is_default = addr.id === addressId
    })

    ElMessage.success('默认地址设置成功')
  } catch (error) {
    ElMessage.error('设置失败，请稍后重试')
  }
}

const handleDeleteAddress = (address) => {
  if (addresses.value.length <= 1) {
    ElMessage.warning('请至少保留一个收货地址')
    return
  }

  addressToDelete.value = address
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  try {
    const addressId = addressToDelete.value.id
    const isDefault = addressToDelete.value.is_default

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // 删除地址
    const index = addresses.value.findIndex(addr => addr.id === addressId)
    if (index !== -1) {
      addresses.value.splice(index, 1)
    }

    // 如果删除的是默认地址，设置新的默认地址
    if (isDefault && addresses.value.length > 0) {
      addresses.value[0].is_default = true
    }

    ElMessage.success('地址删除成功')
    showDeleteConfirm.value = false
    addressToDelete.value = null
  } catch (error) {
    ElMessage.error('删除失败，请稍后重试')
  }
}

const handleSaveAddress = async () => {
  try {
    // 验证手机号
    if (!validatePhoneNumber()) {
      return
    }

    // 验证表单
    await addressFormRef.value.validate()

    saving.value = true

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (isEditing.value) {
      // 更新地址
      const index = addresses.value.findIndex(addr => addr.id === currentAddress.value.id)
      if (index !== -1) {
        const updatedAddress = {
          ...addresses.value[index],
          ...addressForm,
          updated_at: new Date().toISOString().split('T')[0]
        }

        // 处理默认地址设置
        if (addressForm.set_as_default && !updatedAddress.is_default) {
          addresses.value.forEach(addr => {
            addr.is_default = false
          })
          updatedAddress.is_default = true
        }

        addresses.value[index] = updatedAddress
      }

      ElMessage.success('地址更新成功')
    } else {
      // 新增地址
      const newAddress = {
        id: Date.now().toString(),
        ...addressForm,
        is_default: addressForm.set_as_default || addresses.value.length === 0,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0]
      }

      // 如果设置为默认地址，取消其他地址的默认状态
      if (newAddress.is_default) {
        addresses.value.forEach(addr => {
          addr.is_default = false
        })
      }

      addresses.value.unshift(newAddress)
      ElMessage.success('地址添加成功')
    }

    showAddressDialog.value = false
    resetAddressForm()
  } catch (error) {
    console.error('保存地址失败:', error)
  } finally {
    saving.value = false
  }
}

const resetAddressForm = () => {
  Object.assign(addressForm, {
    full_name: '',
    phone_country_code: '86',
    phone_number: '',
    country_code: 'CN',
    state_province: '',
    city: '',
    district_county: '',
    address_line1: '',
    address_line2: '',
    postal_code: '',
    address_tag: 'home',
    set_as_default: addresses.value.length === 0
  })
  phoneError.value = ''
}

const validatePhoneNumber = () => {
  const phone = addressForm.phone_number
  const countryCode = addressForm.phone_country_code

  if (!phone) {
    phoneError.value = '请输入手机号码'
    return false
  }

  // 简单的手机号验证规则
  const phonePatterns = {
    '86': /^1[3-9]\d{9}$/, // 中国手机号
    '1': /^\d{10}$/, // 美国/加拿大
    '44': /^7\d{9}$/, // 英国
    '81': /^0\d{9}$/, // 日本
    '971': /^5\d{8}$/, // 阿联酋
    '65': /^[89]\d{7}$/, // 新加坡
    '60': /^1\d{8,9}$/ // 马来西亚
  }

  const pattern = phonePatterns[countryCode]
  if (pattern && !pattern.test(phone)) {
    phoneError.value = '手机号码格式不正确'
    return false
  }

  phoneError.value = ''
  return true
}

const handleCountryChange = (countryCode) => {
  // 切换国家时清空相关字段
  addressForm.state_province = ''
  addressForm.district_county = ''
  addressForm.postal_code = ''
}

const getCountryName = (code) => {
  const country = countries.value.find(c => c.code === code)
  return country ? country.name : code
}

const getRegionLabel = (countryCode) => {
  const country = countries.value.find(c => c.code === countryCode)
  if (!country) return '省/州'

  switch (countryCode) {
    case 'CN': return '省份'
    case 'US': return '州'
    case 'JP': return '都道府县'
    default: return '省/州'
  }
}

const getRegionProp = (countryCode) => {
  const country = countries.value.find(c => c.code === countryCode)
  return country?.hasState ? 'state_province' : ''
}

const getRegionRules = (countryCode) => {
  const country = countries.value.find(c => c.code === countryCode)
  if (country?.hasState) {
    return [{ required: true, message: `请选择${getRegionLabel(countryCode)}`, trigger: 'change' }]
  }
  return []
}

const getPostalCodeLabel = (countryCode) => {
  switch (countryCode) {
    case 'US': return 'ZIP Code'
    case 'GB': return 'Postcode'
    default: return '邮政编码'
  }
}

const getPostalCodeProp = (countryCode) => {
  const country = countries.value.find(c => c.code === countryCode)
  return country?.postalRequired ? 'postal_code' : ''
}

const getPostalCodeRules = (countryCode) => {
  const country = countries.value.find(c => c.code === countryCode)
  if (country?.postalRequired) {
    return [{ required: true, message: `请输入${getPostalCodeLabel(countryCode)}`, trigger: 'blur' }]
  }
  return []
}

const shouldShowRegionSelect = (countryCode) => {
  const country = countries.value.find(c => c.code === countryCode)
  return country?.hasState && regions.value[countryCode]
}

const shouldShowDistrict = (countryCode) => {
  const country = countries.value.find(c => c.code === countryCode)
  return country?.hasDistrict
}

const getRegionsByCountry = (countryCode) => {
  return regions.value[countryCode] || []
}

const getTagType = (tag) => {
  switch (tag) {
    case 'home': return 'success'
    case 'company': return 'primary'
    default: return 'info'
  }
}

const getTagText = (tag) => {
  switch (tag) {
    case 'home': return '家'
    case 'company': return '公司'
    default: return '其他'
  }
}

const formatPhoneNumber = (phone) => {
  if (phone.length <= 3) return phone
  if (phone.length <= 7) return `${phone.slice(0, 3)} ${phone.slice(3)}`
  return `${phone.slice(0, 3)} ${phone.slice(3, 7)} ${phone.slice(7)}`
}

// 初始化
onMounted(() => {
  // 可以在这里加载地址数据
})
</script>

<style scoped>
.address-page {
  min-height: 100vh;
  background-color: #0f172a;
  color: #e2e8f0;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
  margin-top: 80px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 10px;
}

.page-subtitle {
  color: #94a3b8;
  font-size: 16px;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
}

.add-btn {
  height: 40px;
  font-weight: 500;
}

.address-count {
  color: #94a3b8;
  font-size: 14px;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.empty-address {
  text-align: center;
  padding: 60px 20px;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-text {
  font-size: 20px;
  color: #f1f5f9;
  margin-bottom: 10px;
}

.empty-subtext {
  color: #94a3b8;
  margin-bottom: 20px;
}

.address-card {
  position: relative;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.address-card:hover {
  background: rgba(30, 41, 59, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.address-card.default-address {
  border-color: #3b82f6;
  background: rgba(30, 41, 59, 0.8);
}

.default-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #3b82f6;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.address-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recipient-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.recipient-name {
  font-size: 18px;
  font-weight: 600;
  color: #f1f5f9;
}

.recipient-phone {
  color: #94a3b8;
  font-size: 14px;
}

.address-detail {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.region-info {
  color: #e2e8f0;
  font-size: 14px;
}

.separator {
  margin: 0 8px;
  color: #64748b;
}

.street-address {
  color: #f1f5f9;
  font-size: 16px;
  line-height: 1.5;
}

.postal-code {
  color: #94a3b8;
  font-size: 14px;
}

.address-tag {
  margin-top: 8px;
}

.address-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-self: start;
}

.action-btn {
  justify-content: flex-start;
  padding: 8px 0;
}

.phone-input-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.country-code-select {
  flex-shrink: 0;
}

.phone-number-input {
  flex: 1;
}

.phone-error {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
}

.country-select,
.region-select {
  width: 100%;
}

.delete-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ef4444;
  font-size: 14px;
  margin-top: 8px;
}

.address-form {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 8px;
}

.address-form::-webkit-scrollbar {
  width: 6px;
}

.address-form::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.address-form::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

@media (max-width: 768px) {
  .address-page {
    padding: 15px;
  }

  .action-bar {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .address-card {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .address-actions {
    flex-direction: row;
    justify-content: flex-end;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 16px;
  }

  .recipient-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .phone-input-group {
    flex-direction: column;
  }

  .country-code-select {
    width: 100%;
  }
}
</style>
