<template>
  <div class="login">
    <div class="content">
      <div class="logo">
        <img src="@/assets/vue.svg" alt="logo" />
      </div>
      <van-form @submit="onSubmit" @failed="onFailed">
        <van-field
          v-model.trim="loginInfo.username"
          name="username"
          clearable
          placeholder="input username"
        />
        <van-field
          v-model="loginInfo.password"
          :type="inputType"
          name="password"
          clearable
          placeholder="input password"
        >
          <template #button>
            <div @click="onShowPassword">
              <van-icon v-if="showPassword" name="eye-o" />
              <van-icon v-else name="closed-eye" />
            </div>
          </template>
        </van-field>
        <van-button block type="primary" native-type="submit" class="submit-btn">Login </van-button>
      </van-form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { FieldType } from 'vant';
  import Api, { LoginParams } from '@/api/user';
  import { useLoading } from '@/hooks';
  import debug from '@/utils/debug';
  import watermark from '@/utils/lib/watermark';
  import copyPaste from '@/utils/lib/copy-paste';

  const router = useRouter();
  const route = useRoute();
  const { startLoading, stopLoading } = useLoading();

  const inputType = ref<FieldType>('password');
  const showPassword = ref(false);
  const loginInfo = reactive<LoginParams>({
    username: '',
    password: '',
  });

  onMounted(() => {
    // 进入登录页时获取debug参数
    debug.config(route.query.debug);

    watermark.remove();
    copyPaste.enable();
  });

  onBeforeUnmount(() => {
    // const { username = '', mobile = '' } = auth.getUser();
    watermark.add({
      // content: username + ' ' + mobile,
    });
    copyPaste.disable();
  });

  const onShowPassword = () => {
    showPassword.value = !showPassword.value;
    inputType.value = showPassword.value ? 'text' : 'password';
  };
  const onSubmit = async () => {
    setTimeout(() => {
      router.push('/index');
    }, 3000);

    startLoading();
    const { code, result, message } = await Api.login(loginInfo);
    stopLoading();
    // do something
    router.push('/index');
  };
  const onFailed = (errorInfo = {}) => {
    console.log('failed', errorInfo);
  };
</script>

<style lang="less" scoped>
  .login {
    height: 100%;
    display: flex;
    overflow: auto;

    .content {
      margin: auto;
      width: 500px;
      padding: 40px;
      background-color: #eee;
      .logo {
        text-align: center;
      }
      .van-form {
        .van-cell {
          margin-top: 40px;
        }
        .submit-btn {
          margin-top: 40px;
        }
      }
    }
  }
</style>
