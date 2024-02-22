<template>
  <div ref="shade" class="shade_outFrame" v-show="isDisplay" v-loading="loading">
    <button class="cancelButton" @click="close">
      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIiBmaWxsPSJub25lIj4KICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEzLjMzMTcgMTIuMjYwMUMxMy4wMzg4IDExLjk2NzIgMTIuNTYzOSAxMS45NjcyIDEyLjI3MSAxMi4yNkMxMS45NzgxIDEyLjU1MjkgMTEuOTc4IDEzLjAyNzggMTIuMjcwOSAxMy4zMjA3TDE0LjkzODEgMTUuOTg4NUwxMi4yNzQ0IDE4LjY1MjJDMTEuOTgxNSAxOC45NDUxIDExLjk4MTUgMTkuNDIgMTIuMjc0NCAxOS43MTI5QzEyLjU2NzMgMjAuMDA1OCAxMy4wNDIxIDIwLjAwNTggMTMuMzM1IDE5LjcxMjlMMTUuOTk4NyAxNy4wNDkyTDE4LjY2NTYgMTkuNzE2N0MxOC45NTg0IDIwLjAwOTYgMTkuNDMzMyAyMC4wMDk3IDE5LjcyNjIgMTkuNzE2OEMyMC4wMTkxIDE5LjQyMzkgMjAuMDE5MiAxOC45NDkxIDE5LjcyNjMgMTguNjU2MUwxNy4wNTkzIDE1Ljk4ODZMMTkuNzI0NCAxMy4zMjM1QzIwLjAxNzIgMTMuMDMwNiAyMC4wMTcyIDEyLjU1NTggMTkuNzI0NCAxMi4yNjI5QzE5LjQzMTUgMTEuOTcgMTguOTU2NiAxMS45NyAxOC42NjM3IDEyLjI2MjlMMTUuOTk4OCAxNC45Mjc4TDEzLjMzMTcgMTIuMjYwMVoiIGZpbGw9IiNBMUFCQzkiIGZpbGwtb3BhY2l0eT0iMC44Ii8+CiAgPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTMiIHN0cm9rZT0iI0ExQUJDOSIgc3Ryb2tlLW9wYWNpdHk9IjAuOCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K"/>
    </button>
    <div class="mannuel_model_inner" @click.stop>
      <div class="shade_section">
        <div class="section_box">
          <LoginForm :close-fn="close"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from "@/components/illustration/form/LoginForm";
export default {
  name: "LoginMsgBox",
  components: {LoginForm},
  data(){
    return {
      isDisplay:false,
      loading:false
    }
  },
  created() {
    this.$bus.$on("openLoginForm",()=>{
      this.open();
    });
  },
  methods:{
    close(){
      this.isDisplay = false
    },
    open(){
      this.isDisplay = true
    }
  }
}
</script>

<style scoped>
.shade_outFrame {
  transition-property: opacity;
  transition-duration: 200ms;
  transition-timing-function: ease;
  opacity: 1;
  background-color: rgba(0,0,0,.851);
  position: fixed;
  inset: 0rem;
  border-radius: 0rem;
  z-index: 200;
  pointer-events: auto;
}

.mannuel_model_inner {
  padding: 0;
  border-radius: 0.75rem;
  overflow: hidden;
  margin-top: 70px;
  position: fixed;
  width: 100%;
  top: 0px;
  bottom: 0px;
  max-height: 100%;
  z-index: 200;
  pointer-events: none;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  align-items: flex-start;
}

.shade_section {
  transition-property: transform, opacity;
  transition-duration: 200ms;
  transition-timing-function: ease;
  transform-origin: center center;
  opacity: 1;
  transform: scale(1);
  background-color:#fff;
  border-radius: 0.75rem;
  overflow-x: hidden;
  overflow-y: auto;
  outline: 0;
  -webkit-tap-highlight-color: transparent;
  display: block;
  text-decoration: none;
  color: rgb(0, 0, 0);
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0.0625rem 0.1875rem, rgba(0, 0, 0, 0.05) 0px 2.25rem 1.75rem -0.4375rem, rgba(0, 0, 0, 0.04) 0px 1.0625rem 1.0625rem -0.4375rem;
  pointer-events: all;
  max-width: 100%;
  max-height: calc(100vh - (5vh * 2));
}

.cancelButton {
  top: 70px;
  right: calc(50vw - 250px);
  position: absolute;
  -webkit-tap-highlight-color: transparent;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  cursor: pointer;
  appearance: none;
  font-size: 1rem;
  text-align: left;
  text-decoration: none;
  box-sizing: border-box;
  border-radius: 0.25rem;
  padding: 0;
  line-height: 1;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  min-height: 1.375rem;
  min-width: 1.375rem;
  border: 0.0625rem solid transparent;
  background-color: transparent;
  color: rgb(134, 142, 150);
  margin-left: auto;
  margin-right: 0px;
  width: 2.25rem;
  height: 2.25rem;
  text-transform: none;
  overflow: visible;
}

button:not(.rigid) {
  transition-property: color,background-color,border-color,text-decoration-color,fill,stroke;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
  transition-duration: .15s;
}
[type=button], [type=reset], [type=submit], button {
  -webkit-appearance: button;
  background-image: none;
}

.cancelButton img {
  height: 32px;
  width: 32px;
  border-style: none;
  vertical-align: middle;
  max-width: 100%;
  display: block;
}
.section_box {
  display: flex;
  flex-direction: column;
  background-color: #fff;
}
</style>
