Component({
  data: {
    name: ''
  },
  didMount: function () {
    this.$router = this.$page._router || this.$page.$router
    if (!this.$router) {
      throw new Error('当前页面未绑定router实例，请将$router或_router实例绑定至当前页面');
    }
    this.$router.registerComponent(this);
  },
  didUnmount: function () {
    this.$router.removeComponent(this);
  },
});
