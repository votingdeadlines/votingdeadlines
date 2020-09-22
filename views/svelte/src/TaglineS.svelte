<style>
  p {
    margin-top: 0;
    font-size: 16px;
    text-align: center;
    color: var(--taglineGray);
  }

  p a {
    color: red !important;
  }

  p a:visited {
    color: red !important;
  }
</style>

<script type="text/javascript">
  export let className = ''
</script>

<p class={className}>
  <slot></slot>
</p>
