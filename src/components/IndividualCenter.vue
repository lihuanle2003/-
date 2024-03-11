<template>
  <div class="contanier">
    <div class="card">
      <div class="userInfoCard">
        <div class="userInfoHader">
          <el-avatar
            :size="80"
            src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
          ></el-avatar>
          <u>
            {{ userName }}
          </u>
        </div>
        <div class="userInfoBody">
          <div class="tag">
            <span>
              {{ limitMapper[limit] }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsCookie from "js-cookie";
import { getUserLimit } from "@/apis/user";
import { mapState } from "vuex";
export default {
  data() {
    return {
      userName: "",
      limit: "",
    };
  },

  methods: {
    async getLimit() {
      let res = await getUserLimit(this.userName);
      if (res.data.code === 200) {
        this.limit = Number(res.data.limit.limits);
      } else {
        this.$message.warning("网络请求错误");
      }
    },
  },
  computed: {
    ...mapState("routerAdd", ["limitMapper"]),
  },

  mounted() {
    this.userName = jsCookie.get("userName");
    this.getLimit();
  },
};
</script>
<style lang="less" scoped>
.contanier {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 20px;
  .card {
    flex: 1;
    border: 3px solid rgb(255, 255, 255);
    background-color: rgba(243, 243, 243, 0.8);
    border-radius: 10px;
    padding: 5px;
    .userInfoCard {
      width: 30%;
      height: 100%;
      background-color: rgb(245, 251, 255);
      border-radius: 10px;
      padding: 10px;
      .userInfoHader {
        width: 100%;
        min-height: 166px;
        display: flex;
        flex-direction: column;
        // justify-content: space-evenly;
        align-items: center;
        padding: 10px;
        background-image: url("@/assets/userCenterDefault2.jpeg");
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 10px;
        height: 30%;
        u {
          width: 105px;
          height: 32px;
          position: relative;
          font-size: 20px;
          font-weight: 700;
          color: rgb(255, 0, 0);
          mix-blend-mode: difference;
          letter-spacing: 2px;
          padding: 2px 15px;
          overflow: hidden;
          border-radius: 5px;
          transform-origin: center;
          transition: all 0.3s linear;
          text-align: center;
          &::before,
          &::after {
            content: "";
            user-select: none;
            display: block;
            position: absolute;
            width: 5%;
            height: 200%;
            background: #00a2ff;
            mix-blend-mode: difference;
            top: -50%;
            transition: all 1s ease;
            opacity: 0;
          }
          &::before {
            right: 5%;
            transform: rotate(30deg) translateX(-50%);
          }
          &::after {
            left: 5%;
            transform: rotate(210deg) translateX(-50%);
          }
        }
        &:hover u {
          transform: scale(1.1) translateY(-5px);
        }
        &:hover u::before {
          animation: userNameHeightLight1 2s forwards ease;
        }
        &:hover u::after {
          animation: userNameHeightLight2 2s forwards ease;
        }
        @keyframes userNameHeightLight1 {
          0% {
            right: 5%;
            opacity: 1;
          }
          50% {
            right: 95%;
            opacity: 0;
          }
          100% {
            right: 5%;
            opacity: 0;
          }
        }
        @keyframes userNameHeightLight2 {
          0% {
            left: 5%;
            opacity: 1;
          }
          50% {
            left: 95%;
            opacity: 0;
          }
          100% {
            left: 5%;
            opacity: 0;
          }
        }
        u,
        span {
          margin-bottom: 20px;
          border: 1px solid white;
        }
      }

      .userInfoBody {
        margin-top: 10px;
        width: 100%;
        height: 50%;
        // border: 1px solid black;
        min-height: 277px;
        padding: 10px;
        .tag {
          text-align: center;
          span {
            background: #236cff;
            padding: 2px 15px;
            border: 1px solid white;
            border-radius: 10px;
            font-size: 14px;
            color: rgb(255, 255, 255);
            transition: all 0.5s;
            &:hover {
              color: rgb(155, 248, 255);
            }
          }
        }
      }
    }
  }
}
</style>