/**
 * 用户状态管理
 *
 * 管理登录状态、用户信息、Token 和权限。
 * 数据通过 persist 插件持久化到 localStorage，刷新页面不丢失登录状态。
 *
 * 使用方式：
 *   const userStore = useUserStore()
 *   userStore.token        // 当前 Token
 *   userStore.isLogin      // 是否已登录
 *   userStore.permissions  // 权限列表
 */

import { defineStore } from 'pinia'

/** 用户基本信息 */
export interface UserInfo {
  id?: number
  username?: string
  nickname?: string
  avatar?: string
  email?: string
  phone?: string
  /** 角色列表，如 ['admin', 'editor'] */
  roles?: string[]
  /** 权限标识列表，如 ['user:create', 'user:edit']；'*' 表示超级管理员 */
  permissions?: string[]
}

interface UserState {
  /** 登录凭证，Bearer Token */
  token: string
  /** 用户完整信息 */
  userInfo: UserInfo
}

/** 用户 Store */
export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: {}
  }),

  getters: {
    /** 是否已登录（有有效 Token） */
    isLogin: state => !!state.token,
    /** 用户名，无则为 '游客' */
    username: state => state.userInfo.username || '游客',
    /** 头像 URL */
    avatar: state => state.userInfo.avatar || '',
    /** 角色列表 */
    roles: state => state.userInfo.roles || [],
    /** 权限标识列表 */
    permissions: state => state.userInfo.permissions || []
  },

  actions: {
    /**
     * 设置 Token
     * @param token - Bearer Token，通常由后端登录接口返回
     */
    setToken(token: string) {
      this.token = token
    },

    /**
     * 设置用户信息
     * @param userInfo - 用户基本信息对象
     */
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },

    /**
     * 登录（Mock 阶段为模拟数据）
     * @param username - 用户名
     * @param _password - 密码（Mock 阶段不校验）
     * @returns 包含 token 和 userInfo 的对象
     */
    async login(username: string, _password: string) {
      // TODO: 接入真实接口后替换为：
      //   const res = await request.post<{ token: string; userInfo: UserInfo }>('/login', { username, password })
      //   this.setToken(res.token)
      //   this.setUserInfo(res.userInfo)

      const token = 'mock-token-' + Date.now()
      this.setToken(token)
      this.setUserInfo({
        id: 1,
        username: username,
        nickname: '管理员',
        avatar: '',
        email: 'admin@aohoyo.com',
        roles: ['admin'],
        permissions: ['*']  // '*' 表示拥有所有权限
      })
      return { token, userInfo: this.userInfo }
    },

    /**
     * 获取当前用户信息（Mock 阶段为本地数据）
     * @returns 用户信息对象
     */
    async getUserInfo() {
      // TODO: 接入真实接口后替换为：
      //   const userInfo = await request.get<UserInfo>('/user/info')
      //   this.setUserInfo(userInfo)
      return this.userInfo
    },

    /**
     * 退出登录
     * 重置所有状态，清理 Token 和用户信息
     */
    logout() {
      this.$reset()
    }
  },

  // 开启持久化，刷新页面后登录状态不丢失
  persist: true
})
