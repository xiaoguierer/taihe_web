/**
 * Google OAuth 2.0 认证工具
 * 提供Google登录功能集成
 */

// Google OAuth配置
const GOOGLE_CONFIG = {
  clientId: import.meta.env.VITE_APP_GOOGLE_OAUTH_CLIENT_ID || '',
  scope: 'email profile openid',
  uxMode: 'popup',
  autoSelect: false,
  cancelOnTapOutside: true,
  context: 'signin'
};

/**
 * 初始化Google One Tap登录
 * @param {Function} callback - 登录成功回调函数，接收credentialResponse
 * @returns {Promise<boolean>} 初始化是否成功
 */
export async function initGoogleOneTap(callback) {
  if (!window.google || !window.google.accounts) {
    console.warn('Google Identity Services library not loaded');
    return false;
  }

  if (!GOOGLE_CONFIG.clientId) {
    console.error('Google OAuth client ID is not configured');
    return false;
  }

  try {
    // 初始化Google One Tap
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CONFIG.clientId,
      callback: callback,
      auto_select: GOOGLE_CONFIG.autoSelect,
      ux_mode: GOOGLE_CONFIG.uxMode,
      cancel_on_tap_outside: GOOGLE_CONFIG.cancelOnTapOutside,
      context: GOOGLE_CONFIG.context,
      scope: GOOGLE_CONFIG.scope
    });

    console.log('Google One Tap initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Google One Tap:', error);
    return false;
  }
}

/**
 * 显示Google One Tap登录提示
 * @param {string} elementId - 显示登录提示的容器元素ID
 */
export function showGoogleOneTap(elementId) {
  if (!window.google || !window.google.accounts || !window.google.accounts.id) {
    console.warn('Google Identity Services not available');
    return;
  }

  try {
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        console.log('Google One Tap not displayed:', notification.getNotDisplayedReason());
      } else if (notification.isSkippedMoment()) {
        console.log('Google One Tap skipped:', notification.getSkippedReason());
      } else if (notification.isDismissedMoment()) {
        console.log('Google One Tap dismissed:', notification.getDismissedReason());
      }
    });
  } catch (error) {
    console.error('Failed to show Google One Tap:', error);
  }
}

/**
 * 显示Google登录按钮
 * @param {string} elementId - 按钮容器元素ID
 * @param {Function} callback - 登录成功回调函数
 */
export function renderGoogleButton(elementId, callback) {
  if (!window.google || !window.google.accounts || !window.google.accounts.id) {
    console.warn('Google Identity Services not available');
    return;
  }

  if (!GOOGLE_CONFIG.clientId) {
    console.error('Google OAuth client ID is not configured');
    return;
  }

  try {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CONFIG.clientId,
      callback: callback,
      scope: GOOGLE_CONFIG.scope
    });

    window.google.accounts.id.renderButton(
      document.getElementById(elementId),
      {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 250
      }
    );
  } catch (error) {
    console.error('Failed to render Google button:', error);
  }
}

/**
 * 解析Google ID令牌
 * @param {string} credential - Google返回的凭据
 * @returns {Object} 解析后的用户信息
 */
export function parseGoogleCredential(credential) {
  try {
    // JWT令牌由三部分组成：header.payload.signature
    const parts = credential.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token format');
    }

    // 解码payload部分
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

    return {
      id: payload.sub,
      email: payload.email,
      emailVerified: payload.email_verified || false,
      name: payload.name,
      givenName: payload.given_name,
      familyName: payload.family_name,
      picture: payload.picture,
      locale: payload.locale,
      token: credential,
      expiresAt: payload.exp ? new Date(payload.exp * 1000) : null
    };
  } catch (error) {
    console.error('Failed to parse Google credential:', error);
    throw error;
  }
}

/**
 * 发送Google认证到后端API
 * @param {string} idToken - Google ID令牌
 * @returns {Promise<Object>} 后端返回的认证结果
 */
export async function sendGoogleAuthToBackend(idToken) {
  try {
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idToken: idToken
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Authentication failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to send Google auth to backend:', error);
    throw error;
  }
}

/**
 * 加载Google Identity Services脚本
 * @returns {Promise<void>}
 */
export function loadGoogleIdentityServices() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.accounts) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google Identity Services script loaded');
      resolve();
    };
    script.onerror = () => {
      reject(new Error('Failed to load Google Identity Services script'));
    };

    document.head.appendChild(script);
  });
}

/**
 * 检查是否支持Google One Tap
 * @returns {boolean}
 */
export function isGoogleOneTapSupported() {
  return typeof window !== 'undefined' &&
         window.google?.accounts?.id?.isSupported() === true;
}

/**
 * 注销Google会话
 */
export function googleLogout() {
  if (window.google && window.google.accounts) {
    window.google.accounts.id.disableAutoSelect();
    window.google.accounts.id.revoke(localStorage.getItem('google_id') || '', (done) => {
      console.log('Google session revoked:', done);
    });
  }
}