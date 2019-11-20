Component({
  data: {
    name: ''
  },
  didMount: function() {
    if (!this.$page._router) {
      throw new Error('routerInstance not found');
    }
    this.$page._router.registerComponent(this);
  },
  didUnmount: function() {
    this.$page._router.removeComponent(this);
  },
});
