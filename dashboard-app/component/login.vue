<template lang="html">
  <div id="login-box-wrapper">
    <div id="box-content">
      <div id="wrapper">
        <img
          id="app-logo"
          src="/static/assets/webcms-logo-header.png"/>
        <div id="title">
          {{ $t('Login') }}
        </div>
        <p>
          {{ $t(loginErrorMessage) }}
        </p>
        <div id="form-wrapper">
          <InputText
            class="input"
            inputName="User Name"
            v-bind:inputValue="loginUserName"
            v-bind:onChangeValue="onChangeInputUserName"
            propName=""
            v-bind:errorMessage="loginUserNameError"
            helperMessage="Your user name"/>
          <InputText
            class="input"
            inputName="User Password"
            v-bind:inputValue="loginUserPassword"
            v-bind:onChangeValue="onChangeInputUserPassword"
            propName=""
            inputType="password"
            v-bind:errorMessage="loginUserPasswordError"
            helperMessage="Your password"/>
          <Button
            buttonIcon="input"
            v-bind:buttonAction="acceptAction"
            class="button">
            {{ $t('Enter') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from './templates/button.vue'
import InputText from './templates/input-text.vue'

export default {
  data() {
    return {
      formData: new URLSearchParams(),
      loginUserName: '',
      loginUserPassword: '',
      loginErrorMessage: '',
      loginUserNameError: '',
      loginUserPasswordError: '',
    }
  },
  components: {
    Button,
    InputText,
  },
  watch: {
    loginUserName (newValues, oldValues) {
      this.validateUserName()
    },
    loginUserPassword (newValues, oldValues) {
      this.validateUserPassword()
    },
  },
  methods: {
    async acceptAction () {
      if (!this.validateUserName() || !this.validateUserPassword())
        return

      this.formData.delete('user_name')
      this.formData.delete('user_pass')
      this.formData.append('user_name', this.loginUserName)
      this.formData.append('user_pass', this.loginUserPassword)
      try {
        let data = await this.axios.post(`${ this.$appApiBaseURL }/session/login/`, this.formData, {
            headers: {
              'csrf-token': this.$getCookie('csrf-token'),
            },
          })
        let error_message = data.data.error_message
        if (error_message) {
          this.loginErrorMessage = error_message
          return
        }
        this.$router.go()
      } catch (err) {
        console.error(err)
      }
    },
    onChangeInputUserName (propName, value) {
      this.loginUserName = value
    },
    onChangeInputUserPassword (propName, value) {
      this.loginUserPassword = value
    },
    validateUserName () {
      if (!this.loginUserName) {
        this.loginUserNameError = 'Required'
        return false
      }
      this.loginUserNameError = ''
      return true
    },
    validateUserPassword () {
      if (!this.loginUserPassword) {
        this.loginUserPasswordError = 'Required'
        return false
      }
      this.loginUserPasswordError = ''
      return true
    },
  },
}
</script>

<style scoped lang="css">
#app-logo {
  display: flex;
  height: 48px;
  margin: auto;
  padding: 10px 0;
}

#login-box-wrapper {
  background: rgba(175, 175, 175, 0.25);
  bottom: 0;
  display: flex;
  height: 100%;
  left: 0;
  margin: auto;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 5;
}

#box-content {
  align-self: center;
  background-color: var(--main-active-color);
  border-radius: 20px;
  box-shadow: var(--main-box-shadow);
  margin: auto;
  max-height: 300px;
  max-width: 320px;
  overflow: hidden;
  padding: 10px;
  position: relative;
  width: calc(100% - 40px);
}

#box-content:after {
  background-color: var(--main-box-bg-color);
  border-radius: 100%;
  content: "";
  height: 600px;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  width: 600px;
  z-index: 1;
}

#title {
  color: var(--main-text-color);
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 32px;
  text-align: center;
}

#box-content p {
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  font-weight: 500;
  letter-spacing: 0;
  line-height: 20px;
  margin: 0px;
  text-align: center;
}

#form-wrapper {
  align-items: center;
  display: flex;
  flex-direction: column;
}

#form-wrapper .button {
  margin: 10px 0;
}

#wrapper {
  position: relative;
  z-index: 2;
}
</style>
